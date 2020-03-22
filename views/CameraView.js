import React, { Component, Fragment } from 'react'
import { View, StatusBar, Modal, Text, Image } from 'react-native'
import { Appbar, Menu, Divider, ActivityIndicator, Colors } from 'react-native-paper'
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Toolbar from '../component/Toolbar';
import styles from '../styles';
import App from '../App';

export default class CameraView extends React.Component {

    state = {
        hasAudioPermission: false,
        hasCameraPermission: false,
        cameraType: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        modalVisible: false,
        capturedImage: null,
        capturing: false,
        menuVisible: false,
        savingImage: false,
    }

    setCameraPermission = hasCameraPermission => this.setState({ hasCameraPermission })

    setAudioPermission = hasAudioPermission => this.setState({ hasAudioPermission })
    
    setFlashMode = flashMode => this.setState({ flashMode })

    setCameraType = cameraType => this.setState({ cameraType })

    handleCaptureIn = () => {
        this.setState({ capturing: true })
    };
  
    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {
        await this.captureImage()
    }

    captureImage = async (resolve) => {
        try{
            const photoData = await this.camera.takePictureAsync();
    
            const savedPhoto = await MediaLibrary.createAssetAsync(photoData.uri)
    
            const album = await MediaLibrary.createAlbumAsync('ColorIdentifier', savedPhoto);

            var { uri , height , width } = savedPhoto;

            this.setState({ 
                capturing: false, 
                capturedImage: savedPhoto,
            })

            this.setState({
                modalVisible: true,
            })
    
          }catch(e){
            console.log(e)
          }
    }

    saveImage = async (photo) => {
        try{
            this.setState({ savingImage : true })

            const data = new FormData();
        
            data.append("image", {
                uri: photo.uri,
                name: 'sample',
                type: 'image/jpg'
            });

            var response = await fetch("http://192.168.254.158:8000/predict", {
                method: "POST",
                body: data,
            })

            var blob = await response.blob()

            // console.log(JSON.stringify(blob))//file:///storage/emulated/0/ColorIdentifier/93fb6826-255a-4e20-bbd7-0d2c9f42b253.jpg

            const file = new File([blob], "File name",{ type: "image/png" })

            var dataURL = await new Promise((resolve,reject) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })

            var info = FileSystem.getInfoAsync(dataURL)

            var capturedImage = {
                uri: dataURL
            }

            // var info = await FileSystem.getInfoAsync(dataURL)

            // console.log(info)

            var assetData = await FileSystem.writeAsStringAsync(
                FileSystem.documentDirectory + 'process_image.jpeg',
                dataURL
            )
            console.log(assetData)

            var info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'process_image.jpeg')

            var savedPhoto = await MediaLibrary.createAssetAsync(info.uri)

            var album = await MediaLibrary.createAlbumAsync('ColorIdentifier', savedPhoto);

            console.log(savedPhoto);

            alert("Image Processing Success!");

            this.setState({ capturedImage: capturedImage , savingImage : false, modalVisible: true })


        }catch(error){
            console.log(error)
            alert("Image Processing Failed!");

            this.setState({ savingImage : false, modalVisible: false })

        }
        


    }

    componentDidMount = async () => {

        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA)

        const audioPermission = await Permissions.askAsync(Permissions.AUDIO_RECORDING)

        const hasCameraPermission = (cameraPermission.status === 'granted')

        const hasAudioPermission = (audioPermission.status === 'granted')

        this.setCameraPermission(hasCameraPermission)

        this.setAudioPermission(hasAudioPermission)
    }

    render(){
        var { cameraType, flashMode, capturedImage, menuVisible } = this.state;

        return(
            <Fragment>
                <StatusBar barStyle="light-content" />
                
                <View style={{ flex: 1}}>
                    <Camera 
                        type={cameraType}
                        flashMode={flashMode}
                        style={styles.cameraPreview}
                        ratio="16:9"
                        ref={(camera) => this.camera = camera}
                    />
                </View>

                <Modal
                    style={styles.imageModal}
                    animationType="fade"
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({modalVisible : false})}
                    >
                    <View style={styles.imageModal}>

                        <Appbar dark={true} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            flex:1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0,0,0,0)'
                        }}>
                            <Appbar.BackAction
                            onPress={() => this.setState({modalVisible : false}) }
                            />
                            <Appbar.Content
                                title="Captured Image"
                                subtitle="Raw Image"
                            />
                            {this.state.savingImage ? <ActivityIndicator animating={true} color={Colors.white} /> : <Appbar.Action icon="content-save" color={'#fff'} onPress={() => { this.saveImage(capturedImage) }} />}
                            
                        </Appbar>

                        <View style={styles.imageModalContainer} >
                            {capturedImage ? <Image 
                            source={{uri: capturedImage.uri }} 
                            style={styles.imageFullsize}
                            /> : <Text>No Image Captured</Text>}
                        </View>
                    </View>
                </Modal>

                <Toolbar
                    capturing={false}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                    setCaptureMode={this.setCaptureMode}
                />
            </Fragment>
        )
    }

}