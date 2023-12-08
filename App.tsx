import { View, Text, SafeAreaView, ImageBackground, Image, NativeSyntheticEvent, ImageLoadEventData, Dimensions, TouchableOpacity, Alert, ScrollView, FlatList, StyleSheet } from 'react-native'
import React, { LegacyRef, MutableRefObject, useRef, useState } from 'react'
import ViewShot from "react-native-view-shot";
// import { Asset, CameraOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SaveToGalleryAsync } from './CameraRoll';
import Slider from '@react-native-community/slider';
import ImagePicker from 'react-native-image-crop-picker';

const bgSources = [
  'https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?size=626&ext=jpg&ga=GA1.1.1222169770.1701734400&semt=sph',
  'https://img.freepik.com/free-vector/colorful-watercolor-rainbow-background_125540-151.jpg?w=2000',
  'https://img.freepik.com/free-vector/background-watercolor-texture_122380-11.jpg',
  'https://media.istockphoto.com/id/1248542684/vector/abstract-blurred-colorful-background.jpg?s=612x612&w=0&k=20&c=6aJX8oyUBsSBZFQUCJDP7KZ1y4vrf-wEH_SJsuq7B5I=',
  'https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg',
  'https://cdn.pixabay.com/photo/2016/02/23/07/37/wall-1217083_1280.jpg',
  'https://wallpaperset.com/w/full/7/5/a/545589.jpg',
  'https://www.bhmpics.com/downloads/Light-Blue-Backgrounds-(30-+-Background-Pictures)/21.abstract-blue-wavy-with-blurred-light-curved-lines-background_1409-1240.jpg',
  'https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-05.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP63qD0at3DYyIm0n5Ihj4dGwWjGvjqnrMIA&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqszS9aHzsbBavXdSX-YxlomTBmo7ifmah0nh6TYZpnRUSljs-en-9MfJHLR1BheHXqIs&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcHJMdToLAX_YUbL1H26tjOQMMKuxdOD6uhKbLUrHiGwIg1wsWf1x-FMsj8kyShy-hvyc&usqp=CAU',
  'https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero.jpg',
  'https://www.freecodecamp.org/news/content/images/2021/06/w-qjCHPZbeXCQ-unsplash.jpg',
  'https://img.freepik.com/free-vector/watercolor-sugar-cotton-clouds-background_52683-80661.jpg',
  'https://img.freepik.com/premium-photo/abstract-background-design-images-wallpaper-ai-generated_643360-127781.jpg',
  'https://img.freepik.com/premium-photo/abstract-background-images-wallpaper-ai-generated_643360-130229.jpg',
  'https://img.freepik.com/premium-photo/abstract-background-images-wallpaper-ai-generated_643360-52276.jpg',
  'https://images.unsplash.com/photo-1530293959042-0aac487c21e3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGFuZCUyMHdoaXRlfGVufDB8fDB8fHww',


]

const tmp = 'https://i.pinimg.com/originals/05/e2/18/05e2182f79b9001a76644ea7b72a26ec.jpg'

const window = Dimensions.get('screen')

const paddings = [
  0.95,
  0.9,
  0.85,
  0.8,
  0.75,
  0.7,
]

const chooseBGSize = 70

const App = () => {
  const ref = useRef<LegacyRef<ViewShot> | undefined>();

  const [imageRealSize, setImageRealSize] = useState<[number, number]>([10, 10])
  const [imgUri, setImageUri] = useState(tmp)
  const [bgUri, setBgUri] = useState(bgSources[0])
  const [percentPadding, setPercentPadding] = useState(0.9)
  const [ratio, setRatio] = useState(3 / 2)

  const isLandscape = imageRealSize[0] >= imageRealSize[1]
  const maxRatio = Math.max(imageRealSize[0], imageRealSize[1]) / Math.min(imageRealSize[0], imageRealSize[1])

  let containerSize = [0, 0]
  let containerWidth = 0
  let containerHeight = 0

  if (isLandscape) {
    containerWidth = window.width
    containerHeight = containerWidth / ratio
  }
  else {
    containerHeight = window.height * 0.6
    containerWidth = containerHeight / ratio
  }

  containerSize = [containerWidth, containerHeight]


  let imageNowSize = [0, 0]

  if (isLandscape) // horizontal image 
  {
    const w = containerWidth * percentPadding
    imageNowSize = [w, w * imageRealSize[1] / imageRealSize[0]]
  }
  else {
    const h = containerHeight * percentPadding
    imageNowSize = [h * imageRealSize[0] / imageRealSize[1], h]
  }

  // console.log(ratio, maxRatio, containerSize, imageNowSize);

  const onLoadedImage = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    Image.getSize(imgUri, (w, h) => {
      setImageRealSize([w, h])

      const maxRatio = Math.max(w, h) / Math.min(w, h)


      setRatio(Math.min(1.33, maxRatio))
    })
  }

  const onValueChange_Ratio = (value: number) => {
    console.log(value);

    setRatio(value)

  }
  const onPressSave = () => {
    // @ts-ignore
    ref.current.capture().then(async (uri: string) => {
      console.log("do somesthing with ", uri);

      const res = await SaveToGalleryAsync(uri)

      console.log(res);

      if (res === null)
        Alert.alert('Success')
      else
        Alert.alert('Fail', '' + res)
    });
  }

  const onPressOpenPhoto = async () => {
    try {
      const img = await ImagePicker.openPicker({
        // width: 100,
        // height: 300,
        freeStyleCropEnabled: true,
        cropping: true
      })

      console.log(img.path);

      if (img && img.path)
        setImageUri(img.path)
    }
    catch (e) {
      console.log(e);

    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 10, backgroundColor: 'white', }}>
        {/* @ts-ignore */}
        <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
          <ImageBackground resizeMode='cover' source={{ uri: bgUri }} style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: containerSize[0], height: containerSize[1] }}>
            <View style={{ backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', width: imageNowSize[0], height: imageNowSize[1], borderRadius: 10, overflow: 'hidden' }}>
              <Image onLoad={onLoadedImage} resizeMode='contain' source={{ uri: imgUri }} style={{ backgroundColor: 'red', width: '100%', height: '100%' }} />
            </View>
          </ImageBackground>
        </ViewShot>
        <View style={{ height: chooseBGSize, width: '100%' }}>
          <ScrollView horizontal contentContainerStyle={{}}>
            {
              bgSources.map((uri, index) => {
                return <TouchableOpacity style={{ width: chooseBGSize, height: chooseBGSize }} key={index} onPress={() => setBgUri(uri)}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
              })
            }
          </ScrollView>
        </View>

        <View style={{ width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: 'black' }} />

        <View style={{ gap: 10, paddingHorizontal: 10, flexDirection: 'row', alignContent: 'center' }}>
          <Text style={{ color: 'black', fontSize: 20, }}>Padding</Text>

          <Slider
            style={{ flex: 1, }}
            minimumValue={0.5}
            maximumValue={0.95}
            tapToSeek={true}
            value={percentPadding}
            onValueChange={(value: number) => setPercentPadding(value)}
            minimumTrackTintColor='gray'
            maximumTrackTintColor="#000000"
          />
        </View>

        <View style={{ width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: 'black' }} />

        <View style={{ gap: 10, paddingHorizontal: 10, flexDirection: 'row', alignContent: 'center' }}>
          <Text style={{ color: 'black', fontSize: 20, }}>Ratio</Text>

          <Slider
            style={{ flex: 1, }}
            minimumValue={1}
            maximumValue={maxRatio}
            tapToSeek={true}
            value={ratio}
            onValueChange={onValueChange_Ratio}
            minimumTrackTintColor='gray'
            maximumTrackTintColor="#000000"
          />
        </View>

        {/* <View>
          <ScrollView horizontal contentContainerStyle={{ gap: 10, height: 50 }}>
            {
              borders.map((border, index) => {
                return <TouchableOpacity style={{ padding: 5 }} key={'border' + index} onPress={() => setPercentPadding(border)}>
                  <Text style={{ fontSize: 20, }}>{border}</Text>
                </TouchableOpacity>
              })
            }
          </ScrollView>
        </View> */}

      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', paddingBottom: 10 }}>
        <TouchableOpacity style={{ borderRadius: 5, padding: 10, backgroundColor: 'black' }} onPress={onPressSave}>
          <Text style={{ color: 'white' }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 5, padding: 10, backgroundColor: 'black' }} onPress={onPressOpenPhoto}>
          <Text style={{ color: 'white' }}>Open Photo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default App