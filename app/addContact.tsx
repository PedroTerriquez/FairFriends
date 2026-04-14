import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";

import ContactCard from '@/presentational/ContactCard';
import { AddContactButton } from '@/presentational/Buttons';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import Spinner from "@/presentational/Spinner";
import { findPeople, addFriend } from "@/services/api";
import { useTranslation } from "react-i18next";

export default function addContact() {
    const { t } = useTranslation();
    const [people, setPeople] = useState([])
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchPeople = async () => {
        setLoading(true);
        findPeople(text)
            .then((response) => {
                setPeople(response.data)
            })
            .catch((error) => {
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const onAdd = (id) => {
        addFriend(id)
            .then(() => {
                removeCard(id)
            })
            .catch((error) => {
            })
    }

    const removeCard =(id) => {
        const newPeople = people.filter((person) => person.id !== id)
        setPeople(newPeople)
    }


    const renderEmptyContacts = () => (
        <EmptyList text={t("contactForm.no_contacts_found")}>
            <Text style={baseStyles.label17}>{t('contactForm.try_looking_different')} {''}
                <Pressable onPress={() => { setText(""); }}>
                    <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>{t('contactForm.name')}</Text>
                </Pressable>
            </Text>
        </EmptyList>
    )


    const renderPeople = () => {
        if (people.length == 0) return renderEmptyContacts();
        return people.map(friend => (
            <ContactCard key={friend.id} person={friend}>
                { friend.id && (
                    <AddContactButton
                        testID={`add-contact-row-${friend.id}`}
                        onPressAction={() => onAdd(friend.id)}
                    />
                )}
            </ContactCard>
        ))
    }
    useEffect(() => {
        fetchPeople();
    }, [text]);

    if (loading) return <Spinner />;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={baseStyles.viewContainerFull} >
                    <SearchBarInput testID="add-contact-search" text={text} setText={setText} />
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    >
                        {renderPeople()}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
