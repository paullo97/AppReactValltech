import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Button, Alert, } from 'react-native';
import { useEffect } from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';


const Stack = createStackNavigator();
global.status = 'null'; //Para verificação se foi falha ou não a tentativa de login 

const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('1');
  const [password, setPass] = useState('2');
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>VallTech <Text style={styles.Automacao}>Automação</Text></Text>
      <TextInput style={styles.login}  placeholder='Insira o seu Login' 
        onChangeText={(text) => setName(text)}/>
      <TextInput secureTextEntry={true} style={styles.senha} placeholder= 'Insira a sua Senha'
        onChangeText={(text) => setPass(text)}/>
    
      <View style={{ marginTop: 10, width: 150, borderRadius: 10 }} >
        <Button title="Entrar" /*onPress={createTwoButtonAlert}*/onPress={() => Login({name}, {password}) ? navigation.navigate('Profile') : navigation.navigate('Home')}></Button>
      </View>
      {/* <Text>name: {name} | password: {password}</Text> */}
      <StatusBar style="auto" />
    </View>
  );
};

const ProfileScreen = ({ navigation }) => { //Tela de Profile onde esta os botões depois de realizar o login 
  return (
    <View style={styles.container}>      
      <Button
        title="Go to Home" //Voltar para a tela de login 
        onPress={() =>
          navigation.navigate('Home') //Direciona para o name Stack.Screen com o nome Home; 
        }
      />
      <View style={{ marginTop: 10, width: 150, borderRadius: 10 }} >
        <Button style={{marginTop: 10}} title="Abrir Camera" onPress={() => navigation.navigate('Camera')}></Button>
      </View>
      <View style={{ marginTop: 10, width: 150, borderRadius: 10 }} >
        <Button style={{marginTop: 10}} title="Ler QrCode" onPress={() => navigation.navigate('QrCode')}></Button>
      </View>
    </View>
  ); 
};

const camera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);useEffect(() => {(async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref => {setCameraRef(ref);}}>
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 0.1, alignSelf: 'flex-end' }} onPress={() => { setType( type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);}}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
            if(cameraRef){
              let photo = await cameraRef.takePictureAsync();
              console.log('photo', photo);
            }
          }}>
            <View style={{ borderWidth: 2, borderColor: 'white', height: 50, width:50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{ borderWidth: 2, borderColor: 'white', height: 40, width:40, backgroundColor: 'white'}} />
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const QrCode = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert(
      'Abrir esta URL?',
      data,
      [
        { text: 'Yes', onPress: () => Linking.openURL(data), },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Clique aqui para escanear novamente'} onPress={() => setScanned(false)} />}
    </View>
  );
}

export default function App() {
  const ref = React.useRef(null);
  return (
    <View style={{ flex: 1 }}> 
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerTransparent: true, title: ''}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerTransparent: true, title: 'Central', headerLeft: false, headerTitleAlign: 'center', headerTitleStyle: {fontSize: 40}}}/>
          <Stack.Screen name="Camera" component={camera} options={{headerTransparent: true, title: '', headerLeft: false }}/>
          <Stack.Screen name="QrCode" component={QrCode} options={{headerTransparent: true, title: '', headerLeft: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    height: 40,
    width: 200,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  login: {
    height: 40,
    width: 200,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  senha: {
    height: 40,
    width: 200,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  titulo: {
    marginBottom: 10,
    fontSize: 30,
    color: '#ffa600',

  },
  Automacao: {
    color: 'black'
  },
});

function Login(nome, senha){
  if(nome.name == '1'){
    Alert.alert("Aviso","Campo de Login em Branco",[
      { text: "OK"}
    ]); 
    return false; 
  }
  else if(senha.password == '2'){
    Alert.alert("Aviso","Campo de senha em Branco",[
      { text: "OK"}
    ]); 
    return false; 
  }
  else{
    getLogin(nome.name, senha.password).then(res => {
      if(res.Status == 'FALHA'){
        status = res.Status; 
      }
      else{
        status = res.Status; 
      }
    }
    );    
  }
  if(status == 'FALHA' || status == 'null'){
    return false; 
  }
  else{
    return true;
  }
}

async function getLogin(nome, senha){
  const request = await fetch("http://valltechvpn.dyndns.org:8086/api/EstacaoMovel/GET/LoginOperadorValidacao?strLoginID="+nome.name+"&strSenha="+senha.password);
  return await request.json();
}