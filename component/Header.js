import React, { Component } from 'react'
import { Appbar } from 'react-native-paper'
import styles from '../styles'

export default class Header extends Component {

    render(){
        return(
        <Appbar >
            <Appbar.Action icon="home" onPress={() => console.log('Pressed archive')} />
            <Appbar.Action icon="camera" onPress={() => console.log('Pressed archive')} />
            <Appbar.Action icon="video" onPress={() => console.log('Pressed delete')} />
            <Appbar.Action icon="help-circle" onPress={() => console.log('Pressed delete')} />
        </Appbar>
        )
    }
}