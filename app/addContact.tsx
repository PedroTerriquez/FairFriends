import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '@/presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import SearchBarInput from "@/presentational/SearchBarInput";
import Spinner from "@/presentational/Spinner";

export default function addContact() {
    const [people, setPeople] = useState([])
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const { session } = useSession();

    const fetchPeople = async () => {
        setLoading(true);
        axios.post(`${process.env.EXPO_PUBLIC_API}/user/find`, { search: text }, session)
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
        axios.post(`${process.env.EXPO_PUBLIC_API}/friendships`, { recipient_user_id: id }, session)
            .then((response) => {
                removeCard(id)
            })
            .catch((error) => {
                console.log(error)
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