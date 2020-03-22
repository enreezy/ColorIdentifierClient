import React, { Component, Fragment} from 'react';
import { View, FlatList, Text, StatusBar, Image, Modal, TouchableHighlight, Alert } from 'react-native';
import { Appbar, FAB, Button, Paragraph, Menu, Divider, Provider, List  } from 'react-native-paper';
import GalleryThumbnail from './component/GalleryThumbnail'
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import styles from './styles';
import _ from 'lodash';

export default class App extends Component {

  state = {
    galleryItems : [],
    assets: null,
    modalVisible: false,
    menuVisible: false,
    chosenImage: null,
    colorModalVisible : false,
    colors: []
  }
  

  setAssets  = assets => this.setState({ assets })

  loadAssets = loadAssets => {
    var { assets, galleryItems } = this.state;

    assets = galleryItems.concat(assets.assets);
  
    this.setState({ galleryItems: assets });

    this.setAssets(loadAssets);
  }

  showColorList = async () => { 
    var response = await fetch('https://jonasjacek.github.io/colors/data.json')
    var colors = await response.json()
    this.setState({colors})
    this.setState({ colorModalVisible: true })
  }

  showCamera = () => {
    this.setState({menuVisible: false})
    this.props.navigation.navigate('ImageCapture', { viewImage: this.viewImage })
  }

  viewImage = (image) => {
    this.setState({modalVisible: true})
    this.setState({chosenImage: image})
  }

  galleryEndReach =  async () => {
    var album = await MediaLibrary.getAlbumAsync('ColorIdentifier');

    var { assets } = this.state;

    if (assets.hasNextPage) {
      var newAssets = await MediaLibrary.getAssetsAsync({
        after: assets.endCursor,
        album,
        sortBy: MediaLibrary.SortBy.default
      });

      this.loadAssets(newAssets);
    }

  }

  renderGalleryItem = ({index, item }) => {
    return (
      <TouchableHighlight
      onPress={() => {
        this.viewImage(item)
      }}
      >
          <View style={styles.thumbnailWrapper}
          >
            <Image 
              source={{uri: item.uri }} 
              style={styles.galleryThumbnail}
               />
          </View>
      </TouchableHighlight>
      )
  }

  captureImage = () => {

  }

  reloadGallery = async () => {
    var album = await MediaLibrary.getAlbumAsync('ColorIdentifier');

    var { assets, galleryItems } = this.state;

    if (assets.hasNextPage) {
      var newAssets = await MediaLibrary.getAssetsAsync({
        after: assets.endCursor,
        album,
        sortBy: MediaLibrary.SortBy.default
      });

      assets = galleryItems.concat(newAssets.assets);
    
      this.setState({ galleryItems: assets });
  
      this.setAssets(assets);

    }
  }

  componentDidMount = async () => {
    const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)

    if(cameraRollPermission.granted){
      var album = await MediaLibrary.getAlbumAsync('ColorIdentifier')

      var { assets } = this.state;

      assets = await MediaLibrary.getAssetsAsync({
        album,
        sortBy: MediaLibrary.SortBy.default
      })
      
      this.setAssets(assets)

      this.loadAssets(assets)
    }
  }
  
  render() {
    var { galleryItems, chosenImage, menuVisible, colors } = this.state;

    return (
        <Fragment>

          <StatusBar barStyle="dark-content" />

          <Appbar style={styles.header} >

            <Appbar.Content title="Color Identifier" subtitle="Gallery" />
            <Appbar.Action icon="refresh" color={'#fff'} onPress={this.reloadGallery} />

            <Menu
              visible={menuVisible}
              onDismiss={()=> this.setState({menuVisible: false}) }
              anchor={<Appbar.Action icon="dots-vertical" color={'#fff'} onPress={()=> this.setState({menuVisible: true})} />}
            >
              <Menu.Item icon="camera" onPress={this.showCamera} title="Capture" />
              <Menu.Item icon="video"  onPress={this.showCamera} title="Record" />
              <Menu.Item icon="video-image"  onPress={this.showCamera} title="Live" />
              <Divider />
              <Menu.Item icon="help-circle"  onPress={this.showColorList} title="About" />
            </Menu>

          </Appbar>

          <Modal
            style={styles.imageModal}
            animationType="fade"
            visible={this.state.modalVisible}
            onRequestClose={() => this.setState({modalVisible : false})}
            >
            <View style={styles.imageModal}>
              
              <View style={styles.imageModalContainer} >
                {chosenImage ? <Image 
                  source={{uri: chosenImage.uri }} 
                  style={styles.imageFullsize}
                  /> : <Text>No Image Selected</Text>}
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={this.state.colorModalVisible}
            onRequestClose={() => this.setState({colorModalVisible : false})}
            >
           
              <List.Section title="Registered Colors">
                <FlatList
                    horizontal={false}
                    numColumns={1}
                    data={colors}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {}}
                    initialNumToRender={5}
                    renderItem={({ index, item }) => {
                      return (
                        <View style={{
                          flex:1,
                          alignContent: 'center',
                          justifyContent: 'center'
                        }}>
                          <List.Item title={item.name}
                            titleStyle={{
                              textShadowColor: '#000',
                            }}
                            style={{
                              backgroundColor: item.hexString
                            }}
                          />
                        </View>
                      )
                    }}
                  />  
              </List.Section>
          </Modal>
          

          <View style={styles.gallery}>
             <FlatList
              horizontal={false}
              numColumns={4}
              data={galleryItems}
              onEndReachedThreshold={0.5}
              onEndReached={this.galleryEndReach}
              initialNumToRender={10}
              renderItem={this.renderGalleryItem}
            />  
          </View>
        </Fragment>
    );
  }
}
