import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import baseStyles from './BaseStyles';
import ButtonWithIcon from './ButtonWithIcon';

export default function FormStepContainer({ children, step, setStep, stepPosition, icon, title, onNext = null }) {
    return (
        <View style={[baseStyles.containerCard]}>
            {/* Header with title and toggle button */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[{fontSize: 19, fontWeight: 'bold'}]}> {title} </Text>
            { step == stepPosition && (
                <Pressable onPress={() => setStep(stepPosition == 1 ? stepPosition + 1 : stepPosition - 1)}>
                <MaterialCommunityIcons name={'menu-down'} size={24} color="black" />
                </Pressable>
            )}
            { step != stepPosition && (
                <Pressable onPress={() => setStep(stepPosition)}>
                <MaterialCommunityIcons name={'menu-up'} size={24} color="black" />
                </Pressable>
            )}
            {/* Content and Next button */}
            </View>
            {step === stepPosition && (<View style={{ flexDirection: 'column' }}>
            {children}
            <ButtonWithIcon
                icon={icon}
                text='Next'
                onPress={() => { onNext ? onNext() : setStep(stepPosition + 1); }}
                style={[baseStyles.greenBG, { marginVertical: 10, alignSelf: 'flex-end' }]} />
            </View>)}
        </View>
    );
}