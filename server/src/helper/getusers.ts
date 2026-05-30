import db from "../config";

export const getBank = async (userId: string): Promise<any[]> => {
  return await db("banks")
    .where({ user_id: userId })
    .select("bankName", "accountName", "accountNumber", "bvn");
};

export const getAddress = async (
  userId: string,
  state?: string
): Promise<any[]> => {
  let query = db("address").where({ user_id: userId });

  if (state) {
    query = query.where(
      db.raw("LOWER(state)"),
      "LIKE",
      `%${state.toLowerCase()}%`
    );
  }

  return await query.select("state", "city_lga", "address");
};

export const getUserImage = async (
  userId: string
): Promise<any | undefined> => {
  return await db("userimg")
    .where({ user_id: userId })
    .select("filename")
    .first();
};

export const fetchUsers = async (filters: {
  page?: number;
  limit?: number;
  name?: string;
  interest_area?: string;
  active?: string;
  state?: string;
  user_id?: string; // Added user_id filter
  organization_id?: string; // Added organization_id filter
  all?: boolean; // Fetch all users without pagination
}): Promise<{
  users: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  const {
    page = 1,
    limit = 10,
    name,
    interest_area,
    active,
    state,
    user_id,
    organization_id,
    all = false,
  } = filters;
  const offset = all ? 0 : (page - 1) * limit;
  const pageLimit = all ? undefined : limit;

  // Build the query for users
  let query = db("users").select("id", "email", "role");

  if (user_id) {
    query = query.where("id", user_id); // Filter by user_id if provided
  }

  const allUsers: any[] = await query;

  const allUsersDetails: any[] = [];

  for (const user of allUsers) {
    if (user.role !== "NGO") continue;

    // Fetch user organizations with an optional organization_id filter
    let userOrganizations: any[] = await db("organizations")
      .where({ user_id: user.id })
      .select(
        "id",
        "name",
        "phone",
        "website",
        "interest_area",
        "cac",
        "active"
      );

    // Optional: If you need to apply the organization_id filter
    if (organization_id) {
      userOrganizations = await db("organizations")
        .where({ user_id: user.id, id: organization_id })
        .select(
          "id",
          "name",
          "phone",
          "website",
          "interest_area",
          "cac",
          "active"
        );
    }

    if (userOrganizations.length === 0) {
      if (
        name ||
        interest_area ||
        active !== undefined ||
        state ||
        organization_id
      )
        continue;

      allUsersDetails.push({
        email: user.email,
        error: "User not associated with any account",
      });
      continue;
    }

    for (const organization of userOrganizations) {
      if (name && !organization.name.toLowerCase().includes(name.toLowerCase()))
        continue;
      if (
        interest_area &&
        !organization.interest_area
          .toLowerCase()
          .includes(interest_area.toLowerCase())
      )
        continue;
      if (active !== undefined && organization.active.toString() !== active)
        continue;

      const userDetails: any = {
        id: organization.id,
        email: user.email,
        name: organization.name,
        phone: organization.phone,
        website: organization.website,
        interest_area: organization.interest_area,
        cac: organization.cac,
        active: organization.active,
        bank: await getBank(user.id),
        address: await getAddress(user.id, state),
        userimage: await getUserImage(user.id),
      };

      allUsersDetails.push(userDetails);
    }
  }

  const paginatedUsers = all
    ? allUsersDetails
    : allUsersDetails.slice(offset, offset + limit);
  const totalItems = allUsersDetails.length;
  const totalPages = all ? 1 : Math.ceil(totalItems / limit);

  return {
    users: paginatedUsers,
    totalItems,
    totalPages,
    currentPage: all ? 1 : page,
  };
};
