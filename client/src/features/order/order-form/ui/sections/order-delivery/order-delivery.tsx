'use client';

import { InputDefaultField } from '@/src/shared/ui';
import { TabsRoot } from '@/src/shared/ui/tabs/tabs';
import { FC, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeliveryMode, OrderSchemaValues } from '../../../model';
import { getClasses } from './styles/get-classes';

export const OrderDeliverySection: FC = memo(() => {
  const { control, setValue } = useFormContext<OrderSchemaValues>();

  const deliveryMode = useWatch({
    control,
    name: 'deliveryMode',
  });

  const {
    cnDelivery,
    cnDeliveryLabel,
    cnDeliveryHeader,
    cnDeliveryInputs,
    cnDeliveryInputsWrapper,
  } = getClasses({});

  const tabs = [
    { label: 'Доставка', value: DeliveryMode.Delivery },
    { label: 'Самовывоз', value: DeliveryMode.Pickup },
  ];

  return (
    <div className={cnDelivery}>
      <div className={cnDeliveryHeader}>
        <p className={cnDeliveryLabel}>Доставка</p>
        <TabsRoot<DeliveryMode>
          tabs={tabs}
          activeTab={deliveryMode}
          onChange={v =>
            setValue('deliveryMode', v, {
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: false,
            })
          }
        />
      </div>

      {deliveryMode === DeliveryMode.Delivery && (
        <div className={cnDeliveryInputsWrapper}>
          <InputDefaultField
            control={control}
            name="address.street"
            label="Улица*"
            placeholder="Пушкина"
          />

          <div className={cnDeliveryInputs}>
            <InputDefaultField
              control={control}
              name="address.house"
              label="Дом"
              placeholder="1а"
            />
            <InputDefaultField
              control={control}
              name="address.entrance"
              label="Подъезд"
              placeholder="1"
              type="number"
            />
            <InputDefaultField
              control={control}
              name="address.floor"
              label="Этаж"
              placeholder="2"
              type="number"
            />
            <InputDefaultField
              control={control}
              name="address.apartment"
              label="Квартира"
              placeholder="2"
              type="number"
            />
            <InputDefaultField
              control={control}
              name="address.intercom"
              label="Домофон"
              placeholder="0000"
              contentRight={null}
            />
          </div>
        </div>
      )}

      {deliveryMode === DeliveryMode.Pickup && (
        <InputDefaultField
          control={control}
          name="restaurantId"
          label="Ресторан"
          placeholder="Выберите ресторан"
        />
      )}
    </div>
  );
});
