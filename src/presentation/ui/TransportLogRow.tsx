import { Transport } from '@src/domain/entities/Transport';
import { useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AuthContext } from '../../../contexts/authContext';
import { __ } from '../../../localization/Localization';
import Styles from '../../../styles/Styles';

export type TransportLogRowProps = {
  transport: Transport;
};

export default function TransportLogRow(props: TransportLogRowProps) {
  const auth = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <View
      style={{
        borderBottomColor: Styles.colors.white,
        borderBottomWidth: 5,
      }}>
      <TouchableOpacity
        onPress={() => {
          setShowDetails(!showDetails);
        }}
        style={{
          backgroundColor: showDetails ? Styles.colors.grayDark : null,
          paddingVertical: Styles.margins.large,
          paddingHorizontal: Styles.container.paddingHorizontal,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ width: '33%' }}>{props.transport.getReadableStartDate()}</Text>
        <Text style={{ width: '33%', textAlign: 'center' }}>{props.transport.getReadableDuration()}</Text>
        <Text style={{ width: '33%', textAlign: 'right' }}>{props.transport.isSynced() ? __('Yes') : __('No')}</Text>
      </TouchableOpacity>

      {showDetails ? (
        <View
          style={{
            paddingVertical: Styles.margins.large,
            paddingHorizontal: Styles.container.paddingHorizontal,
            backgroundColor: Styles.colors.gray,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '33%' }}>
            <Text style={{ fontSize: Styles.fontSizes.small }}>{__('Driver')}</Text>
            <Text style={{ fontSize: Styles.fontSizes.small }}>
              {auth.user?.first_name} {auth.user?.last_name}
            </Text>
          </View>
          <View style={{ width: '33%' }}>
            <Text style={{ textAlign: 'center', fontSize: Styles.fontSizes.small }}>{__('Distance')}</Text>
            <Text style={{ textAlign: 'center', fontSize: Styles.fontSizes.small }}>
              {props.transport.getReadableDistance()}
            </Text>
          </View>
          <View style={{ width: '33%' }}>
            <Text style={{ textAlign: 'right', fontSize: Styles.fontSizes.small }}>{__('Cause')}</Text>
            <Text style={{ textAlign: 'right', fontSize: Styles.fontSizes.small }}>{props.transport.reason}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
