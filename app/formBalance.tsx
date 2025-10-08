import { createGroup, findFriends } from "@/services/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ScrollView, Text } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Person from '@/presentational/Person';
import EmptyList from "@/presentational/EmptyList";
import PlaceholderPerson from "@/presentational/PlaceholderPerson";
import SearchBarInput from "@/presentational/SearchBarInput";
import InputWithLabel from "@/presentational/InputWithLabel";
import FormStepContainer from "@/presentational/FormStepContainer";

export default function Contacts() {
    const [friends, setFriends] = useState([]);
    const [text, setText] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedPlaceholders, setSelectedPlaceholders] = useState([]);
    const [placeholderNames, setPlaceholderNames] = useState({});
    const [step, setStep] = useState(1);
    const [groupName, setGroupName] = useState("");

    const fetchFriends = async () => {
        findFriends(text)
            .then((response) => {
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
                // Remove the last placeholder
                const newPlaceholders = prev.slice(0, -1);
                setSelectedFriends(friendsPrev => {
                    // Remove the last placeholder (0) from *selectedFriends*
                    const index = friendsPrev.lastIndexOf(0);
                    if (index > -1) {
                        // Remove the placeholder at the found index
                        return [...friendsPrev.slice(0, index), ...friendsPrev.slice(index + 1)];
                    }
                    return friendsPrev;
                });
                // Also remove the corresponding name entry
                setPlaceholderNames(namesPrev => {
                    const newNames = { ...namesPrev };
                    delete newNames[prev.length - 1];
                    return newNames;
                });
                return newPlaceholders;
            }
            return prev;
        });
    }

    const createGroupHandler = () => {
        const memberIds = selectedFriends.map((id, idx) => {
            if (id === 0) {
                return placeholderNames[idx] || `Placeholder`;
            } else {
                return id;
            }
        })
            
        createGroup(memberIds, groupName)
            .then((response) => {
                router.replace({
                    pathname: '/balance',
                    params: { id: response.data.id }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const renderContacts = (friends) => {
        if (friends.length == 0 && text !== "") return <EmptyList text="No contacts found">{null}</EmptyList>;

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

    const handleNameChange = (idx, value) => {
        setPlaceholderNames((prev) => ({
            ...prev,
            [idx]: value,
        }));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView keyboardDismissMode="on-drag" >
                <View>
                    <FormStepContainer step={step} setStep={setStep} stepPosition={1} title="Select Members" icon={<MaterialIcons name="navigate-next" size={32} color="white" />}>
                        <View>
                            <View >
                                <SearchBarInput text={text} setText={setText} />
                                {renderContacts(friends)}
                            </View>
                        </View>
                    </FormStepContainer>
                </View>
                <View>
                    <FormStepContainer step={step} setStep={setStep} stepPosition={2} title="Placeholder Names" icon={<MaterialIcons name="navigate-next" size={32} color="white" />}>
                        <View>
                            {selectedPlaceholders.map((_, idx) => (
                                <React.Fragment key={`placeholder-fragment-${idx}`}>
                                  <InputWithLabel
                                    key={`placeholder-name-${idx}`}
                                    label={`Placeholder ${idx + 1}`}
                                    placeholder={`e.g., Friend ${idx + 1}`}
                                    value={placeholderNames[idx] || ""}
                                    onChangeText={(_name, value) => handleNameChange(idx, value)} 
                                    error={null}
                                    editable={true}
                                  />
                                </React.Fragment>
                              ))}
                        </View>
                    </FormStepContainer>
                </View>
                <View>
                    <FormStepContainer step={step} setStep={setStep} stepPosition={3} title="Name Split" onNext={createGroupHandler} icon={<MaterialIcons name="navigate-next" size={32} color="white" />}>
                        <InputWithLabel
                            name='name'
                            label="Group Name"
                            placeholder="e.g., Weekend Trip"
                            value={groupName}
                            onChangeText={(_name, value) => setGroupName(value)}
                            error={null}
                            editable={true}
                        />
                    </FormStepContainer>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
