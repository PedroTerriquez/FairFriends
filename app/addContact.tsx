import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '@/presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";

export default function addContact() {
    const [people, setPeople] = useState([])
    const [text, setText] = useState("");
    const { session } = useSession();

    const fetchPeople = async () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/user/find`, { search: text }, session)
            .then((response) => {
                console.log(response)
                setPeople(response.data)
            })
            .catch((error) => {
                console.log(error);
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
        if (people.length == 0) return EmptyList("No contacts found")

        return people.map(friend => (
            <Person person={friend}>
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

    return (
        <ScrollView style={[baseStyles.viewContainerFull]}>
            <View>
                <View style={[baseStyles.searchBarInput, baseStyles.viewRowWithSpace]}>
                    <Ionicons name="search" size={20} color="gray" style={{ marginRight: 5 }} />
                    <TextInput
                        style={{ flex: 1 }}
                        placeholder="Search"
                        placeholderTextColor="#666"
                        value={text}
                        onChangeText={(newText) => { setText(newText); }}
                        autoFocus={true}
                    />
                </View>
            </View>
            {renderPeople()}
        </ScrollView>
    );
}