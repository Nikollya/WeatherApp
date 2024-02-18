import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {theme} from "../theme";
import {MagnifyingGlassIcon, XMarkIcon} from "react-native-heroicons/outline";
import {MapPinIcon} from "react-native-heroicons/solid";
import {useCallback} from "react";
import {debounce} from "lodash";
import {fetchLocations} from "../api/weather";


const SearchSection = (props) => {
    const handleSearch = search=>{
        // console.log('value: ',search);
        if(search && search.length>2)
            fetchLocations({cityName: search}).then(r=>{
                // console.log('got locations: ',data);
                setLocations(r);
            })
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    return (
        <div>
            <View style={{height: '7%'}} className="mx-4 relative z-50">
                <View
                    className="flex-row justify-end items-center rounded-full"
                    style={{backgroundColor: props.showSearch? theme.bgWhite(0.2): 'transparent'}}>

                    {
                        props.showSearch? (
                            <TextInput
                                onChangeText={handleTextDebounce}
                                placeholder="Search city"
                                placeholderTextColor={'lightgray'}
                                className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                            />
                        ):null
                    }
                    <TouchableOpacity
                        onPress={()=> toggleSearch(!props.showSearch)}
                        className="rounded-full p-3 m-1"
                        style={{backgroundColor: theme.bgWhite(0.3)}}>
                        {
                            props.showSearch? (
                                <XMarkIcon size="25" color="white" />
                            ):(
                                <MagnifyingGlassIcon size="25" color="white" />
                            )
                        }

                    </TouchableOpacity>
                </View>
                {
                    props.locations.length>0 && props.showSearch?(
                        <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                            {
                                props.locations.map((loc, index)=>{
                                    let showBorder = !(index + 1 === props.locations.length);
                                    let borderClass = showBorder? ' border-b-2 border-b-gray-400':'';
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={()=> handleLocation(loc)}
                                            className={"flex-row items-center border-0 p-3 px-4 mb-1 "+borderClass}>
                                            <MapPinIcon size="20" color="gray" />
                                            <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    ):null
                }

            </View>
        </div>
    );
};

export default SearchSection;