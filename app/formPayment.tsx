import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

import baseStyles from '@/presentational/BaseStyles';
import InputWithLabel from '@/presentational/InputWithLabel';
import PaymentKeyPad from '@/presentational/PaymentKeypad';
import SuccessPaymentModal from '@/presentational/SuccessPaymentModal';
import FormStepContainer from '@/presentational/FormStepContainer';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';

export default function addPayment() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(params.title || '');
  const [category, setCategory] = useState(params.category || '');
  const [location, setLocation] = useState(params.location || '');
  const [image, setImage] = useState(params.image || '');
  const [isModalVisible, setModalVisible] = useState(false);
  const [creatorId, setCreatorId] = useState(params.members ? params?.members[0]?.id : null);
  const [errors, setErrors] = useState({ title: '', amount: '', category: '', location: '', image: '' });
  const [amount, setAmount] = useState(() => {
    if (!params.amount) return '0';
    return params.amount.replace(/[$,]/g, '') || '0';
  });

  const handleKeyPadPress = (key) => {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1) || '0');
    } else {
      setAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const createParams = () => {
    return {
      title: title,
      amount: parseFloat(amount),
      category: category,
      creator_id: creatorId,
      paymentable_id: params.paymentable_id,
      paymentable_type: params.type,
      location: location,
      recipient_id: params.recipient_id,
    };
  };

  const updateParams = () => {
    return {
      id: params.payment_id,
      amount: parseFloat(amount),
      creator_id: creatorId,
      title: title,
      category: category,
      location: location,
      image: image,
    };
  };

  const validateFields = () => {
    const newErrors = { title: '', category: '', location: '', image: '' };

    if (!title.trim()) newErrors.title = t('formPayment.titleRequired');
    if (!category.trim()) newErrors.category = t('formPayment.categoryRequired');
    if (!location.trim()) newErrors.location = t('formPayment.locationRequired');

    setErrors(newErrors);

    if ( !Object.values(newErrors).some(error => error) ) {
      setStep(step + 1);
    }

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      if (params.payment_id) {
        await updatePayment(params.payment_id, updateParams())
        setModalVisible(true);
      } else {
        await createPayment(createParams())
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[baseStyles.viewContainerFull]}>
          <View style={{ flex: 0}}>
            <AvatarInfoHeader user={params.recipient_name} text={t('formPayment.payingFor')} />
          </View>
          {/* Payment Information Section */}
          <View style={[ step === 2 ? { flex: 0 } : { flex: 6 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={1} onNext={validateFields}
              icon={<MaterialIcons name="navigate-next" size={32} color="white" />}
              title={ t('formPayment.paymentInformation')} >
              <View>
                <InputWithLabel label={t('formPayment.title')} name='title' value={title}
                  onChangeText={(_name, value) => setTitle(value)}
                  placeholder={t('formPayment.enter_title')} error={errors.title} editable={true} />
                <InputWithLabel label={t('formPayment.location')} name='location' value={location}
                  onChangeText={(_name, value) => setLocation(value)}
                  placeholder={t('formPayment.enter_location')} error={errors.location} editable={true} />
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                >
                  <Picker.Item label={t('formPayment.enter_category')} value="" />
                  <Picker.Item label={t('formPayment.categoryFood')} value="food" />
                  <Picker.Item label={t('formPayment.categoryAccommodation')} value="accommodation" />
                  <Picker.Item label={t('formPayment.categoryTransportation')} value="transportation" />
                  <Picker.Item label={t('formPayment.categoryActivities')} value="activities" />
                  <Picker.Item label={t('formPayment.categoryParty')} value="party" />
                  <Picker.Item label={t('formPayment.categoryGroceries')} value="groceries" />
                  <Picker.Item label={t('formPayment.categoryMisc')} value="misc" />
                </Picker>
                {errors.category && <Text style={baseStyles.errorText}>{errors.category}</Text>}
                {params.members && params.admin == true && (
                  <View>
                    <Text style={baseStyles.label17}>{t('formPayment.doneBy')}</Text>
                    <Picker
                      selectedValue={creatorId}
                      onValueChange={(member_id) => setCreatorId(member_id)}
                      style={[baseStyles.picker, { height: 100 }]}
                      itemStyle={{ color: 'black' }} >
                      {JSON.parse(params.members).map(member => (
                        <Picker.Item key={member.id} label={member.name} value={member.id} />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
            </FormStepContainer>
          </View>
          {/* Payment Section */}
          {
            step === 2 && (<PaymentKeyPad amount={amount} amountSuggestion={params.amount_payments} onKeyPress={handleKeyPadPress} handleSubmit={handleSubmit} />
            )
          }
        </View>
      </TouchableWithoutFeedback>

      <SuccessPaymentModal
        visible={isModalVisible}
        total={amount}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />
    </>
  );
}