import React, { Component} from 'react';
import { View, Image } from 'react-native';
import { Surface } from 'react-native-paper';
import styles from '../styles';

export default class GalleryThumbnail extends Component {

  render(){
    const { uri } = this.props;
  
    return (
      <View >
        <Image
        source={{ uri }}
        style={styles.galleryThumbnail}
        />
      </View>
    )
  }
}