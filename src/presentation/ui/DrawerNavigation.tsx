import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import * as React from 'react';
import { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Constants from 'expo-constants';
import { AuthContext } from '../../../contexts/authContext';
import { LanguageContext } from '../../../contexts/languageContext';
import { __ } from '../../../localization/Localization';
import Styles from '../../../styles/Styles';

export const DrawerNavigation = (props) => {
  const auth = useContext(AuthContext);
  const [language, setLanguage] = useContext(LanguageContext);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Text
        style={{
          fontSize: Styles.fontSizes.small,
          color: Styles.colors.grayDarker,
          margin: Styles.margins.medium,
          textAlign: 'right',
        }}>
        v{Constants.expoConfig?.version}-{Constants.expoConfig?.android?.versionCode || null}
      </Text>
      {/* Temporarily disabled because of bug causing crash when changing language the pressing Android back button.
      <View
        style={{
          borderTopColor: Styles.colors.gray,
          borderTopWidth: 1,
          paddingHorizontal: Styles.margins.medium,
          paddingVertical: 30,
        }}>
        <TouchableOpacity
          style={{
            paddingVertical: Styles.margins.medium,
            padding: Styles.margins.medium,
            backgroundColor: language === 'sw' ? '#E0EFFF' : null,
            borderRadius: 5,
          }}
          onPress={() => {
            updateLocale('sw');
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 13 }}
              source={require('../../../assets/flag-tz.png')}
            />
            <Text
              style={{
                marginLeft: Styles.margins.medium,
                color: language === 'sw' ? '#007AFF' : Styles.colors.grayDarker,
              }}>
              {__('Kiswahili')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: Styles.margins.medium,
            padding: Styles.margins.medium,
            backgroundColor: language === 'en' ? '#E0EFFF' : null,
            borderRadius: 5,
          }}
          onPress={() => {
            updateLocale('en');
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 13 }}
              source={require('../../../assets/flag-en.png')}
            />
            <Text
              style={{
                marginLeft: Styles.margins.medium,
                color: language === 'en' ? '#007AFF' : Styles.colors.grayDarker,
              }}>
              {__('English')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: Styles.margins.medium,
            padding: Styles.margins.medium,
            backgroundColor: language === 'fr' ? '#E0EFFF' : null,
            borderRadius: 5,
          }}
          onPress={() => {
            updateLocale('fr');
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 13 }}
              source={require('../../../assets/flag-fr.png')}
            />
            <Text
              style={{
                marginLeft: Styles.margins.medium,
                color: language === 'fr' ? '#007AFF' : Styles.colors.grayDarker,
              }}>
              {__('French')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: Styles.margins.medium,
            padding: Styles.margins.medium,
            backgroundColor: language === 'rn' ? '#E0EFFF' : null,
            borderRadius: 5,
          }}
          onPress={() => {
            updateLocale('rn');
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 20, height: 13 }}
              source={require('../../../assets/flag-rn.png')}
            />
            <Text
              style={{
                marginLeft: Styles.margins.medium,
                color: language === 'rn' ? '#007AFF' : Styles.colors.grayDarker,
              }}>
              {__('Kirundi')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
       */}

      {auth.isLoggedIn() ? (
        <View
          style={{
            borderTopColor: Styles.colors.gray,
            borderTopWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}>
          <TouchableOpacity
            style={{
              paddingVertical: Styles.margins.medium,
            }}
            onPress={() => {
              auth.logout().then(() => {
                props.navigation.closeDrawer();
              });
            }}>
            <Text style={{ ...Styles.text.default }}>{__('Logout')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
