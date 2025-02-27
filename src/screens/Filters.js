// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { useNavigation } from '@react-navigation/native';

// const FilterScreen = ({ route }) => {
//     const navigation = useNavigation();
//     const { onApplyFilters } = route.params || {};

//     const [selectedFilter, setSelectedFilter] = useState('Price Range');
//     // Change state to arrays to handle multiple selections
//     const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
//     // const [selectedRatings, setSelectedRatings] = useState([]);
//     // const [selectedMaterialTypes, setSelectedMaterialTypes] = useState([]);
//     const [selectedWeightRanges, setSelectedWeightRanges] = useState([]);
//     const [selectedPurities, setSelectedPurities] = useState([]);

//     const handleFilterSelect = (filter) => {
//         setSelectedFilter(filter);
//     };

//     console.log(selectedPriceRanges);
    

//     // Helper function to toggle selection in an array
//     const toggleSelection = (array, value, setArray) => {
//         if (array.includes(value)) {
//             setArray(array.filter(item => item !== value));
//         } else {
//             setArray([...array, value]);
//         }
//     };

//     const handleApply = () => {
//         const filters = {
//             priceRanges: selectedPriceRanges,
//             weightRanges: selectedWeightRanges,
//             purities: selectedPurities
//         };
//         console.log(filters);
        
        
//         // Pass filters back to SingleCategoryScreen
//         if (onApplyFilters) {
//             onApplyFilters(filters);
//         }
//         navigation.goBack();
//     };

//     const handleClear = () => {
//         setSelectedPriceRanges([]);
//         // setSelectedRatings([]);
//         // setSelectedMaterialTypes([]);
//         setSelectedWeightRanges([]);
//         setSelectedPurities([]);
//         console.log('Filters cleared');
//     };

//     return (
//         <>
//             <TouchableOpacity
//                 style={styles.closeButtonContainer}
//                 onPress={() => navigation.goBack()}
//             >
//                 <AntDesign name="left" size={24} color="#dca818" style={styles.icon} />
//                 {/* <Text style={styles.closeButtonText}>Close</Text> */}
//             </TouchableOpacity>
//             <View style={styles.actionButtonsContainer}>
//                 <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
//                     <Text style={styles.clearbuttonText}>Clear</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
//                     <Text style={styles.applybuttonText}>Apply</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.container}>
//                 <View style={styles.filtersContainer}>
//                     {/* Filter options remain the same */}
//                     <TouchableOpacity
//                         style={[styles.filterOption, selectedFilter === 'Price Range' && styles.selectedFilter]}
//                         onPress={() => handleFilterSelect('Price Range')}
//                     >
//                         <Text style={styles.filterText}>Price Range</Text>
//                     </TouchableOpacity>
//                     {/* <TouchableOpacity
//                         style={[styles.filterOption, selectedFilter === 'Rating' && styles.selectedFilter]}
//                         onPress={() => handleFilterSelect('Rating')}
//                     >
//                         <Text style={styles.filterText}>Rating</Text>
//                     </TouchableOpacity> */}
//                     {/* <TouchableOpacity
//                         style={[styles.filterOption, selectedFilter === 'Material Type' && styles.selectedFilter]}
//                         onPress={() => handleFilterSelect('Material Type')}
//                     >
//                         <Text style={styles.filterText}>Material Type</Text>
//                     </TouchableOpacity> */}
//                     <TouchableOpacity
//                         style={[styles.filterOption, selectedFilter === 'Weight Range' && styles.selectedFilter]}
//                         onPress={() => handleFilterSelect('Weight Range')}
//                     >
//                         <Text style={styles.filterText}>Weight Range</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.filterOption, selectedFilter === 'Purity' && styles.selectedFilter]}
//                         onPress={() => handleFilterSelect('Purity')}
//                     >
//                         <Text style={styles.filterText}>Purity</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <ScrollView style={styles.selectedFilterContainer}>
//                     {selectedFilter === 'Price Range' && [
//                         { label: 'Below ₹10000', value: '0-10000' },
//                         { label: '₹10000 - ₹50000', value: '10000-50000' },
//                         { label: '₹50000 - ₹100000', value: '50000-100000' },
//                         { label: '₹100000 - ₹500000', value: '100000-500000' },
//                         { label: '₹500000 - ₹1000000', value: '500000-1000000' },
//                     ].map((item, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={styles.checkboxContainer}
//                             onPress={() => toggleSelection(selectedPriceRanges, item.value, setSelectedPriceRanges)}
//                         >
//                             <View style={[styles.checkbox, selectedPriceRanges.includes(item.value) && styles.checkedCheckbox]}>
//                                 {selectedPriceRanges.includes(item.value) && (
//                                     <Text style={styles.checkSign}>✔</Text>
//                                 )}
//                             </View>
//                             <Text style={styles.checkboxLabel}>{item.label}</Text>
//                         </TouchableOpacity>
//                     ))}

//                     {/* {selectedFilter === 'Rating' && (
//                         <View style={styles.optionDetails}>
//                             {[5, 4].map((rating) => (
//                                 <TouchableOpacity 
//                                     key={rating} 
//                                     onPress={() => toggleSelection(selectedRatings, `${rating}`, setSelectedRatings)}
//                                     style={styles.rating}
//                                 >
//                                     <View style={[styles.checkbox, selectedRatings.includes(`${rating}`) && styles.checkedCheckbox]}>
//                                         {selectedRatings.includes(`${rating}`) && (
//                                             <Text style={styles.checkSign}>✔</Text>
//                                         )}
//                                     </View>
//                                     <View style={styles.rating_star}>
//                                         {Array.from({ length: 5 }).map((_, i) => (
//                                             <AntDesign
//                                                 key={i}
//                                                 name={i < rating ? 'star' : 'staro'}
//                                                 size={15}
//                                                 color="#DCA818"
//                                             />
//                                         ))}
//                                     </View>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                     )} */}

//                     {/* {selectedFilter === 'Material Type' && ['Diamond', 'Gold', 'Silver'].map((type) => (
//                         <TouchableOpacity
//                             key={type}
//                             style={styles.checkboxContainer}
//                             onPress={() => toggleSelection(selectedMaterialTypes, type, setSelectedMaterialTypes)}
//                         >
//                             <View style={[styles.checkbox, selectedMaterialTypes.includes(type) && styles.checkedCheckbox]}>
//                                 {selectedMaterialTypes.includes(type) && (
//                                     <Text style={styles.checkSign}>✔</Text>
//                                 )}
//                             </View>
//                             <Text style={styles.checkboxLabel}>{type}</Text>
//                         </TouchableOpacity>
//                     ))} */}

//                     {selectedFilter === 'Weight Range' && [
//                         '0 grams - 5 grams',
//                         '5 grams - 10 grams',
//                         '10 grams - 15 grams',
//                         '15 grams - 20 grams',
//                         '20 grams - 25 grams',
//                         'above 25 grams',
//                     ].map((range) => (
//                         <TouchableOpacity
//                             key={range}
//                             style={styles.checkboxContainer}
//                             onPress={() => toggleSelection(selectedWeightRanges, range, setSelectedWeightRanges)}
//                         >
//                             <View style={[styles.checkbox, selectedWeightRanges.includes(range) && styles.checkedCheckbox]}>
//                                 {selectedWeightRanges.includes(range) && (
//                                     <Text style={styles.checkSign}>✔</Text>
//                                 )}
//                             </View>
//                             <Text style={styles.checkboxLabel}>{range}</Text>
//                         </TouchableOpacity>
//                     ))}

//                     {selectedFilter === 'Purity' && ['23K', '22K', '21K', '20K', '18K', '16K', '14K', '12K', '10K'].map((purity) => (
//                         <TouchableOpacity
//                             key={purity}
//                             style={styles.checkboxContainer}
//                             onPress={() => toggleSelection(selectedPurities, purity, setSelectedPurities)}
//                         >
//                             <View style={[styles.checkbox, selectedPurities.includes(purity) && styles.checkedCheckbox]}>
//                                 {selectedPurities.includes(purity) && (
//                                     <Text style={styles.checkSign}>✔</Text>
//                                 )}
//                             </View>
//                             <Text style={styles.checkboxLabel}>{purity}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </ScrollView>
//             </View>

//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         flex: 1,
//         borderTopWidth: 1,
//         borderColor: '#f4f0ec'
//     },
//     filtersContainer: {
//         width: '40%',
//         borderRightWidth: 1,
//         borderRightColor: '#f4f0ec',
//         // backgroundColor:'#f4f0ec'
//     },
//     filterOption: {
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderBottomWidth: 1,
//         borderColor: '#f4f0ec'
//     },
//     selectedFilter: {
//         borderRightWidth: 2,
//         borderColor: '#dca818',
//         backgroundColor: '#fff',
//     },
//     filterText: {
//         fontSize: 16,
//         color: '#026456',
//     },
//     selectedFilterContainer: {
//         width: '60%',
//         padding: 20,
//     },
//     selectedFilterTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#dca818'
//     },
//     optionDetails: {
//         marginTop: 10,
//     },
//     optionLabel: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     optionButton: {
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         // backgroundColor: '#026456',
//         color: '#fff',
//         marginVertical: 5,
//         borderRadius: 5,
//     },
//     optionDetails: {
//         marginTop: 10,
//     },
//     optionLabel: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 5,
//         borderBottomWidth: 1,
//         borderColor: '#d3d3d3',
//         marginBottom: 10,
//         paddingBottom: 8,
//     },
//     checkbox: {
//         width: 20,
//         height: 20,
//         textAlign: 'center',
//         borderWidth: 1,
//         borderColor: '#026456',
//         borderRadius: 3, // For rounded edges
//         marginRight: 10,
//         backgroundColor: '#fff',
//     },
//     checkedCheckbox: {
//         backgroundColor: '#026456', // Color when selected
//     },
//     checkboxLabel: {
//         fontSize: 14,
//         color: '#000',
//     },
//     checkSign: {
//         textAlign: 'center',
//         fontSize: 14,
//         color: '#dca818', // Checkmark color
//     },
//     rating: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderColor: '#d3d3d3',
//         marginBottom: 15,
//         paddingBottom: 8,
//     },
//     rating_star: {
//         flexDirection: 'row',
//         gap: 2,
//     },
//     actionButtonsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         padding: 10,
//         marginTop: 50,
//     },
//     clearButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//         marginRight: 10,
//         borderWidth: 1,
//         borderColor: '#dca818'
//     },
//     applyButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: '#026456'
//     },
//     applybuttonText: {
//         color: '#026456',
//         fontWeight: 'bold',
//     },
//     clearbuttonText: {
//         color: '#dca818',
//         fontWeight: 'bold',
//     },
//     closeButtonContainer: {
//         position: 'absolute',
//         flexDirection: 'row',
//         top: 20,
//         left: 20,
//         width: 40,
//     },
//     closeButtonText: {
//         fontSize: 16,
//         color: '#dca818',
//         fontWeight: 'bold',
//     },
// });

// export default FilterScreen;




















import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
 
const FilterScreen = ({ route }) => {
    const navigation = useNavigation();
    const { onApplyFilters } = route.params || {};
 
    const [selectedFilter, setSelectedFilter] = useState('Price Range');
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedWeightRanges, setSelectedWeightRanges] = useState([]);
    const [selectedPurities, setSelectedPurities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedMaterialTypes, setSelectedMaterialTypes] = useState([]);
 
    const filterOptions = [
        { id: 'Price Range', title: 'Price Range' },
        { id: 'Weight Range', title: 'Weight Range' },
        { id: 'Purity', title: 'Purity' }
    ];
 
    const filterData = {
        'Price Range': [
            { label: 'Below ₹10,000', value: '0-10000' },
            { label: '₹10,000 - ₹50,000', value: '10000-50000' },
            { label: '₹50,000 - ₹1,00,000', value: '50000-100000' },
            { label: '₹1,00,000 - ₹5,00,000', value: '100000-500000' },
            { label: '₹5,00,000 - ₹10,00,000', value: '500000-1000000' },
        ],
        'Weight Range': [
            { label: '0 - 5 grams', value: '0-5' },
            { label: '5 - 10 grams', value: '5-10' },
            { label: '10 - 15 grams', value: '10-15' },
            { label: '15 - 20 grams', value: '15-20' },
            { label: '20 - 25 grams', value: '20-25' },
            { label: 'Above 25 grams', value: '25+' },
        ],
        'Purity': [
            { label: '23K', value: '23K' },
            { label: '22K', value: '22K' },
            { label: '21K', value: '21K' },
            { label: '20K', value: '20K' },
            { label: '18K', value: '18K' },
            { label: '16K', value: '16K' },
            { label: '14K', value: '14K' },
            { label: '12K', value: '12K' },
            { label: '10K', value: '10K' },
        ]
    };
 
    const toggleSelection = (array, value, setArray) => {
        if (array.includes(value)) {
            setArray(array.filter(item => item !== value));
        } else {
            setArray([...array, value]);
        }
    };
 
    const getSelectedArray = (filter) => {
        switch (filter) {
            case 'Price Range': return selectedPriceRanges;
            case 'Weight Range': return selectedWeightRanges;
            case 'Purity': return selectedPurities;
            default: return [];
        }
    };
 
    const getSetterFunction = (filter) => {
        switch (filter) {
            case 'Price Range': return setSelectedPriceRanges;
            case 'Weight Range': return setSelectedWeightRanges;
            case 'Purity': return setSelectedPurities;
            default: return () => {};
        }
    };
 
    const handleApply = () => {
        const filters = {
            priceRanges: selectedPriceRanges,
            weightRanges: selectedWeightRanges,
            purities: selectedPurities
        };
        if (onApplyFilters) {
            onApplyFilters(filters);
        }
        navigation.goBack();
    };
 
    const handleClear = () => {
        setSelectedPriceRanges([]);
        setSelectedWeightRanges([]);
        setSelectedPurities([]);
    };
 
    const getSelectedCount = () => {
        return selectedPriceRanges.length + selectedWeightRanges.length + selectedPurities.length;
    };
 
    return (
<SafeAreaView style={styles.safeArea}>
<View style={styles.header}>
<TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
>
<AntDesign name="left" size={24} color="#dca818" />
</TouchableOpacity>
<Text style={styles.headerTitle}>Filters</Text>
<TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClear}
>
<Text style={styles.clearButtonText}>Clear all</Text>
</TouchableOpacity>
</View>
 
            <View style={styles.container}>
<View style={styles.sidebar}>
<ScrollView>
                        {filterOptions.map((option) => (
<TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.filterTab,
                                    selectedFilter === option.id && styles.selectedFilterTab
                                ]}
                                onPress={() => setSelectedFilter(option.id)}
>
<Text style={[
                                    styles.filterTabText,
                                    selectedFilter === option.id && styles.selectedFilterTabText
                                ]}>
                                    {option.title}
</Text>
</TouchableOpacity>
                        ))}
</ScrollView>
</View>
 
                <View style={styles.content}>
<ScrollView style={styles.optionsContainer}>
                        {filterData[selectedFilter].map((item, index) => (
<TouchableOpacity
                                key={index}
                                style={styles.optionItem}
                                onPress={() => toggleSelection(
                                    getSelectedArray(selectedFilter),
                                    item.value,
                                    getSetterFunction(selectedFilter)
                                )}
>
<View style={[
                                    styles.checkbox,
                                    getSelectedArray(selectedFilter).includes(item.value) && styles.checkboxSelected
                                ]}>
                                    {getSelectedArray(selectedFilter).includes(item.value) && (
<AntDesign name="check" size={16} color="#fff" />
                                    )}
</View>
<Text style={styles.optionLabel}>{item.label}</Text>
</TouchableOpacity>
                        ))}
</ScrollView>
</View>
</View>
 
            <View style={styles.footer}>
<TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApply}
>
<Text style={styles.applyButtonText}>
                        Apply ({getSelectedCount()})
</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
    );
};
 
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f0ec',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#026456',
    },
    backButton: {
        padding: 8,
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        color: '#dca818',
        fontSize: 14,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: '35%',
        backgroundColor: '#f4f0ec',
    },
    filterTab: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    selectedFilterTab: {
        backgroundColor: '#fff',
        borderLeftColor: '#dca818',
    },
    filterTabText: {
        fontSize: 15,
        color: '#666',
    },
    selectedFilterTabText: {
        color: '#026456',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    optionsContainer: {
        padding: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f0ec',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#026456',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#026456',
    },
    optionLabel: {
        fontSize: 15,
        color: '#333',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f4f0ec',
    },
    applyButton: {
        backgroundColor: '#026456',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
 
export default FilterScreen;