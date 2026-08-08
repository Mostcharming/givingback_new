import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen, FormField, InlineNotice, LoadingState, PageHeader, PrimaryButton, SectionTitle } from '@/components/app-ui';
import { Palette, Radius } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useApiQuery } from '@/hooks/use-api';
import { apiPut } from '@/lib/api';
import { asArray, asRecord, getString } from '@/lib/data';

export default function EditProfileScreen() {
  const { refreshSession, session } = useAuth();
  const profile = useApiQuery<unknown>('/auth');
  const profileData = asRecord(profile.data);
  const account = asRecord(profileData.user);
  const addressData = asRecord(asArray(profileData.address)[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [interestArea, setInterestArea] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: 'danger' | 'success' } | null>(null);

  useEffect(() => {
    setName(getString(account.name));
    setPhone(getString(account.phone ?? account.phoneNumber));
    setWebsite(getString(account.website));
    setInterestArea(getString(account.interest_area));
    setState(getString(account.state) || getString(addressData.state));
    setCity(getString(account.city_lga) || getString(addressData.city_lga));
    setAddress(getString(account.address) || getString(addressData.address));
    setAbout(getString(account.about));
  }, [
    account.about,
    account.address,
    account.city_lga,
    account.interest_area,
    account.name,
    account.phone,
    account.phoneNumber,
    account.state,
    account.website,
    addressData.address,
    addressData.city_lga,
    addressData.state,
  ]);

  const save = async () => {
    if (!name.trim()) {
      setNotice({ message: 'Add a profile or organization name.', tone: 'danger' });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      await apiPut('/auth', {
        about,
        address,
        city_lga: city,
        interest_area: interestArea,
        name,
        phone,
        phoneNumber: phone,
        state,
        website,
      }, session?.token);
      await Promise.all([profile.refetch(), refreshSession()]);
      setNotice({ message: 'Your profile has been updated.', tone: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Unable to update profile', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (profile.loading) return <AppScreen><LoadingState label="Loading your profile..." /></AppScreen>;

  return (
    <AppScreen>
      <PageHeader eyebrow="Public identity" subtitle="Keep the details donors and impact partners use to recognize you current." title="Edit profile" />
      {notice ? <InlineNotice message={notice.message} tone={notice.tone} /> : null}
      <View style={styles.form}>
        <SectionTitle title="Profile details" />
        <FormField icon="person-outline" label={session?.user.role === 'NGO' ? 'Organization name' : 'Name'} onChangeText={setName} value={name} />
        <FormField icon="call-outline" keyboardType="phone-pad" label="Phone number" onChangeText={setPhone} value={phone} />
        {session?.user.role === 'NGO' ? <FormField autoCapitalize="none" icon="globe-outline" keyboardType="url" label="Website" onChangeText={setWebsite} value={website} /> : null}
        <FormField icon="leaf-outline" label="Impact area" onChangeText={setInterestArea} value={interestArea} />
        <FormField icon="location-outline" label="State" onChangeText={setState} value={state} />
        <FormField icon="navigate-outline" label="City / LGA" onChangeText={setCity} value={city} />
        <FormField icon="map-outline" label="Address" multiline onChangeText={setAddress} value={address} />
        {session?.user.role !== 'NGO' ? <FormField icon="information-circle-outline" label="About" multiline onChangeText={setAbout} value={about} /> : null}
        <PrimaryButton icon="checkmark-circle-outline" label="Save changes" loading={loading} onPress={() => void save()} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: 14,
    padding: 17,
  },
});
