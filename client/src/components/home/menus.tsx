import { Link, NavLink } from "react-router-dom";
import { Fragment } from "react";

const Home = (
  <Fragment>
    <li>
      <Link to="/">Home One</Link>
    </li>
    <li>
      <Link to="/index-2">Home Two</Link>
    </li>
  </Fragment>
),
  Project = (
    <Fragment>
      <li>
        <Link to="/latest-projects">Recent Projects</Link>
      </li>
    </Fragment>
  ),
  News = (
    <Fragment>
      <li>
        <Link to="/news-standard">News Standard</Link>
      </li>
      <li>
        <Link to="/news-details">News Details</Link>
      </li>
    </Fragment>
  ),
  Pages = (
    <Fragment>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/company-overview">Company Overview</Link>
      </li>
      <li>
        <Link to="/team-member">Team Member</Link>
      </li>
      <li>
        <Link to="/pricing">Pricing</Link>
      </li>
      <li>
        <Link to="/testimonial">Testimonial</Link>
      </li>
      <li>
        <Link to="/faq">FAQ</Link>
      </li>
    </Fragment>
  );

export { Home, Project, Pages, News };
