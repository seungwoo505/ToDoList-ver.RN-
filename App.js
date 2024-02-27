import { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { images } from "./images";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [TextList, SetTextList] = useState("");
  const [EndText, SetEndText] = useState([]);

  useEffect(()=>{
    const getData = async () =>{
      const storage = JSON.parse(await AsyncStorage.getItem("Text"));
      if(storage) SetEndText(storage);
    }
    getData();
  }, []);

  useEffect(() =>{
    const setData = async () =>{
      await AsyncStorage.setItem("Text", JSON.stringify(EndText));
    }
    setData();
  }, [EndText]);

  const changeCompleted = (id) =>{
    SetEndText(
      EndText.map((e)=>
        e.id === id ? {...e, completed:!e.completed} : e
      )
    );
  };

  const removeText = (id) =>{
    SetEndText(
      EndText.filter((e)=>e.id !== id)
    );
  };

  const editText = (id) =>{
    SetEndText(
      EndText.map((e)=>{
        return e.id === id ? {...e, edit: !e.edit} : e
      }
      )
    );
  };

  const editInput = (id, text) =>{
    SetEndText(
      EndText.map((e)=>
        e.id === id ? {...e, title: text} : e
      )
    );
  };

  const ToDoList = ({ item }) =>(
    <View style={styles.todoContainer}>
      <TouchableOpacity onPress={()=> changeCompleted(item.id)}>
        <Image source={item.completed ? images.checkBox : images.box}/>
      </TouchableOpacity>
      {
        item.edit ?
          <TextInput
            maxLength={50}
            onChangeText={(text)=> editInput(item.id, text)}
            value={item.title}
            autoFocus
            onBlur={()=> {
              if(item.title === "") removeText(item.id);
              else editText(item.id);
            }}
          />
          :
          <>
            <TouchableOpacity onPress={()=> changeCompleted(item.id)}>
              <Text style={item.completed&&styles.completed}>
                {item.title}
              </Text>
            </TouchableOpacity>
            {
              !item.completed &&
              <TouchableOpacity onPress={()=> editText(item.id)}>
                <Image source={images.edit}/>
              </TouchableOpacity>
            }
          </>
      }
      <TouchableOpacity onPress={()=> removeText(item.id)}>
        <Image source={images.close}/>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="default" backgroundColor="#ffffff" />
        <TextInput
          placeholder="할 일을 입력하세요"
          value={TextList}
          maxLength={20}
          onChangeText={(text)=> SetTextList(text)}
          onBlur={()=>{
            if(TextList !== "") SetEndText([...EndText, {id:EndText.length, title:TextList, edit:false, completed:false}]);
            SetTextList('');
          }}
        />
        <FlatList
          data={EndText}
          renderItem={ToDoList}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#e2e2e2",
    padding: 20
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'a2a2a2'
  },

  completed: {
    textDecorationLine: 'line-through',
  }
});
