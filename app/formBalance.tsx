import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '../presentational/Person';
import { useSession } from "@/services/authContext";
import baseStyles from '../presentational/BaseStyles';
import EmptyList from "@/presentational/EmptyList";
import PlaceholderPerson from "@/presentational/PlaceholderPerson";

export default function Contacts() {
    const [friends, setFriends] = useState([]);
    const [text, setText] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedPlaceholders, setSelectedPlaceholders] = useState([]);
    const { session } = useSession();
    const [step, setStep] = useState(0);
    const [groupName, setGroupName] = useState("");

    const fetchFriends = async () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/friendships/find`, { search: text }, session)
            .then((response) => {
                console.log(response)
                setFriends(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const toggleSelectFriend = (friend_id) => {
        setSelectedFriends((prev) => {
            if (prev.includes(friend_id)) {
                return prev.filter((friend) => friend !== friend_id);
            } else if (prev.length < 10) {
                return [...prev, friend_id];
            }
            return prev;
        });
    };

    const addPlaceholder = () => {
        if ((selectedPlaceholders.length + selectedFriends.length) < 10) {
            setSelectedPlaceholders(prev => [...prev, prev.length]);
            setSelectedFriends(prev => [...prev, 0]);
        }
    };

    const removePlaceholder = () => {
        setSelectedPlaceholders(prev => {
            if (prev.length > 0) {
                const newPlaceholders = prev.slice(0, -1);
                setSelectedFriends(friendsPrev => {
                    const index = friendsPrev.lastIndexOf(0);
                    if (index > -1) {
                        return [...friendsPrev.slice(0, index), ...friendsPrev.slice(index + 1)];
                    }
                    return friendsPrev;
                });
                return newPlaceholders;
            }
            return prev;
        });
    }

    const createGroup = () => {
        const memberIds = selectedFriends;
        axios.post(`${process.env.EXPO_PUBLIC_API}/balances/`, { members: memberIds, name: groupName }, session)
            .then((response) => {
                router.push({
                    pathname: '/balance',
                    params: { id: response.data.id }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const renderContacts = (friends) => {
        if (friends.length == 0 && text === "") return EmptyList("No friends");
        if (friends.length == 0 && text !== "") return EmptyList("No contacts found");

        let fullList = [];
        fullList.push(
            <PlaceholderPerson onClick={addPlaceholder} key="add-placeholder">
                <Ionicons name="ellipse-outline" size={30} color="gray" />
            </PlaceholderPerson>
        );
        selectedPlaceholders.forEach((_, idx) => {
            fullList.push(
                <PlaceholderPerson onClick={removePlaceholder} key={`placeholder-${idx}`}>
                    <Ionicons name="checkmark-circle" size={30} color="green" />
                </PlaceholderPerson>
            );
        });

        Object.keys(friends).map((key) => {
            const friend = friends[key];
            //fullList.push(<Text key={key} style={[baseStyles.textGray, baseStyles.smallLabel]}>{key}</Text>);
            fullList.push(
                <Person
                    key={friend.id}
                    person={friend}
                    onClick={() => toggleSelectFriend(friend.id)} >
                    {selectedFriends.includes(friend.id) ? <Ionicons name="checkmark-circle" size={30} color="green" /> : <Ionicons name="ellipse-outline" size={30} color="gray" />}
                </Person>
            );
        });
        return fullList;
    };

    useEffect(() => {
        fetchFriends();
    }, [text]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                { step == 0 && (<View style={baseStyles.viewContainerFull}>
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
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
                        {renderContacts(friends)}
                        {selectedFriends.length > 0 && (
                            <TouchableOpacity
                                style={[baseStyles.floatingButton, baseStyles.greenBG]}
                                onPress={() => {setStep(1);}}>
                                <MaterialIcons name="navigate-next" size={32} color="white" />
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>)}
                {step == 1 && (
                    <>
                        <TouchableOpacity style={[baseStyles.button, baseStyles.viewRow]} onPress={() => setStep(0)}>
                            <Ionicons name="arrow-back" size={20} color="black" style={{ marginLeft: 5 }} />
                            <Text style={[baseStyles.buttonText, baseStyles.textBlack, baseStyles.marginLeft5]}>Modify members</Text>
                        </TouchableOpacity>
                        <View style={[baseStyles.viewContainerFull, baseStyles.alignItemsCenter]}>
                            <Text style={[baseStyles.title24, baseStyles.boldText, { paddingTop: '40%' }]}>
                                New Fair Split
                            </Text>
                            <Text style={{ marginBottom: 20, textAlign: 'center', width: '80%' }}>
                                We almost finished, pick a good name for your team
                            </Text>
                            <TextInput
                                style={[baseStyles.searchBarInput, { marginBottom: 20, width: '80%' }]}
                                placeholder="Group Name"
                                placeholderTextColor="#666"
                                value={groupName}
                                onChangeText={(text) => { setGroupName(text); }}
                            />
                            <TouchableOpacity
                                style={[
                                    baseStyles.button,
                                    baseStyles.successBG,
                                    { padding: 15, alignItems: 'center', borderRadius: 10 }
                                ]}
                                onPress={createGroup}
                            >
                                <Text style={[baseStyles.buttonText]}>Create Group</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}