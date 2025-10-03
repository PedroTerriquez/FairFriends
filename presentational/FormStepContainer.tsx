import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import baseStyles from './BaseStyles';
import ButtonWithIcon from './ButtonWithIcon';

export default function FormStepContainer({ children, step, setStep, stepPosition, icon, title, onNext = null }) {
    return (
        <View style={[baseStyles.containerCard]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[{fontSize: 19, fontWeight: 'bold'}]}> {title} </Text>
                { step == stepPosition && (
                    <Pressable onPress={() => setStep(stepPosition == 1 ? stepPosition : stepPosition - 1)}>
                        <MaterialCommunityIcons name={'menu-down'} size={24} color="black" />
                    </Pressable>
                )}
                { step != stepPosition && (
                    <Pressable onPress={() => setStep(stepPosition)}>
                        <MaterialCommunityIcons name={'menu-up'} size={24} color="black" />
                    </Pressable>
                )}
            </View>
            {step === stepPosition && (<View style={{ marginTop: 10 }}>
                {children}
                <ButtonWithIcon
                    icon={icon}
                    text='Next'
                    onPress={() => { onNext ? onNext() : setStep(stepPosition + 1); }}
                    style={[baseStyles.greenBG, { marginVertical: 10, alignItems: 'flex-end' }]} />
            </View>)}
        </View>
    );
}