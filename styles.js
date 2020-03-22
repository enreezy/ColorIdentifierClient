import { StyleSheet, StatusBar, Dimensions } from 'react-native'

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      top: StatusBar.currentHeight,
      marginTop: 60, 
    },
    header: {
      position: 'absolute',
      top: StatusBar.currentHeight,
      left: 0,
      right: 0,
      flex:1,
      justifyContent: 'flex-end'
    },
    bottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom:0,
    },
    bottomToolbar: {
      width: winWidth,
      position: 'absolute',
      height: 100,
      bottom: 0,
    },
    gallery: {
      flex: 1,
      backgroundColor: '#fff',
      top: StatusBar.currentHeight,
      marginTop: 60, 
    },
    galleryThumbnail : {
      flex: 1,
      width: null,
      alignSelf: 'stretch'
    },
    thumbnailWrapper : {
      borderColor: "#FFFFFF",
      height: (Dimensions.get('window').height/5) - 12,
      width: (Dimensions.get('window').width/3) - 4,
      margin: 2,
      padding: 2,
    },
    imageModal :{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: "rgba(0,0,0,0.9)"
    },
    imageModalContainer : {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height/2,
    },
    imageFullsize : {
      borderColor: "#FFFFFF",
      flex: 1,
      width: null,
      alignSelf: 'stretch'
    },
    cameraPreview: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      flexDirection: 'row',
    },
    captureBtn: {
      width: 60,
      height: 60,
      borderWidth: 2,
      borderRadius: 60,
      borderColor: "#FFFFFF",
    },
    captureBtnActive: {
        width: 80,
        height: 80,
    },
    captureBtnInternal: {
        width: 76,
        height: 76,
        borderWidth: 2,
        borderRadius: 76,
        backgroundColor: "red",
        borderColor: "transparent",
    },
    alignCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

  export default styles