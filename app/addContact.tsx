import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Person from '@/presentational/Person';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import Spinner from "@/presentational/Spinner";
import { findPeople, addFriend } from "@/services/api";

export default function addContact() {
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
        addFriend(id, session)
            .then((response) => {
                removeCard(id)
            })
            .catch((error) => {
            })
    }

    const removeCard =(id) => {
        const newPeople = people.filter((person) => person.id !== id)
        setPeople(newPeople)
    }

    const renderPeople = () => {
        if (people.length == 0) return (<EmptyList text={"No contacts found"}>
            <Text style={baseStyles.label17}>Try looking different {''}
                <Pressable onPress={() => { setText(""); }}>
                    <Text style={[baseStyles.boldText, baseStyles.link]}>name</Text>
                </Pressable>
            </Text>
        </EmptyList>)

        return people.map(friend => (
            <Person key={friend.id} person={friend}>
                { friend.id && (
                    <TouchableOpacity style={[baseStyles.circleButton, baseStyles.blueBG]} onPress={() => onAdd(friend.id)}>
                        <MaterialIcons name="person-add" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </Person>
        ))
    }
    useEffect(() => {
        fetchPeople();
    }, [text]);

    if (loading) return <Spinner />;

    return (
        <ScrollView 
            contentContainerStyle={[baseStyles.viewContainerFull]} 
            keyboardDismissMode="on-drag"
        >
            <SearchBarInput text={text} setText={setText} />
            {renderPeople()}
        </ScrollView>
    );
}