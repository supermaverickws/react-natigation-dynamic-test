import { registerRootComponent } from 'expo';
import { Text, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createMaterialBottomTabNavigator();

// dynamic register component.
const ComMap = new Map();
ComMap.set("app", App)
ComMap.set("home", Home)
ComMap.set("third", Third)

//json config route
const Configg = {
    topBar: null,
    topTabs: null,
    bottomTabs: {
        option: {},
        child: [
            {
                topBar: null,
                content: {
                    path: "third",
                    option: {
                    }
                },
                option: {
                    tabBarLabel: "topTabs2ss",
                }
            },
            {
                topBar: null,
                topTabs: {
                    option: {

                    },
                    child: [
                        {
                            topBar: null,
                            content: {
                                path: "third"
                            },
                            option: {
                                tabBarLabel: "topTabs1"
                            }
                        },
                        {
                            topBar: null,
                            content: {
                                path: "third"
                            },
                            option: {
                                tabBarLabel: "fast"
                            }
                        }
                    ]
                },
                option: {
                    tabBarLabel: "bottomTabs2"
                }
            }, {
                bottomTabs: {
                    option: {},
                    child: [
                        {
                            topBar: null,
                            content: {
                                path: "third",
                                option: {

                                }
                            },
                            option: {
                                tabBarLabel: "topTabs2ss"
                            }
                        },
                        {
                            topBar: null,
                            topTabs: {
                                option: {

                                },
                                child: [
                                    {
                                        topBar: null,
                                        content: {
                                            path: "third"
                                        },
                                        option: {
                                            tabBarLabel: "topTabs1"
                                        }
                                    },
                                    {
                                        topBar: null,
                                        content: {
                                            path: "home"
                                        },
                                        option: {
                                            tabBarLabel: "hello"
                                        }
                                    }
                                ]
                            },
                            option: {
                                tabBarLabel: "bottomTabs1"
                            }
                        }
                    ]
                },
                option: {
                    tabBarLabel: "bottomTabs3"
                }
            }
        ]
    },
    content: null
}

//dynamic make root route
function RootStack() {
    const Config = React.useMemo(() => applyKey(Configg), [])
    console.log(JSON.stringify(Config))
    return Config && <Stack.Navigator screenOptions={{
        headerShown: true,
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' },
    }}>

        {
            // Config.topBar && <Text> TopBars </Text>
        }
        {
            Config.bottomTabs && <Stack.Screen
                name={Config.name}
                component={BottomTabFactory}
                initialParams={{
                    child: Config.bottomTabs.child
                }} />
        }
        {
            Config.topTabs && <Stack.Screen
                name={Config.name}
                component={MyTopTabFactory}
                initialParams={{
                    child: Config.topTabs.child
                }} />
        }
        {
            // dynamic route child for always navigation.push("home",{child: Configg}) 
            <Stack.Screen name="home" component={PageFactory} />
        }
    </Stack.Navigator>
}

function BottomTabFactory({ route }) {
    return <BottomTab.Navigator>
        {
            route.params.child.map(k => {
                return <BottomTab.Screen
                    name={k.name}
                    component={PageFactory}
                    options={{
                        ...(k.option || {})
                    }}
                    initialParams={{
                        child: k,
                    }} />
            })
        }
    </BottomTab.Navigator>
}

function MyTopTabFactory({ route }) {
    return <TopTab.Navigator>
        {
            route.params.child.map(k => {
                return <TopTab.Screen
                    name={k.name}
                    component={PageFactory}
                    options={{
                        ...(k.option || {})
                    }}
                    initialParams={{
                        child: k,
                    }} />
            })
        }
    </TopTab.Navigator>
}

function PageFactory({ navigation, route }) {
    const Config = route.params.child
    console.log("PageFactory:" + JSON.stringify(Config))
    return <>
        {
            // Config.topBar && <Text> TopBars </Text>
        }
        {
            Config.topTabs && <TopTab.Navigator>
                {
                    Config.topTabs.child.map((k, index) => {
                        return <TopTab.Screen name={k.name} component={PageFactory}
                            initialParams={{
                                child: k
                            }}
                            options={{
                                ...(k.option || {})
                            }} />
                    })
                }
            </TopTab.Navigator>
        }
        {
            Config.bottomTabs && <BottomTab.Navigator>
                {
                    Config.bottomTabs.child.map(k => {
                        return <BottomTab.Screen
                            name={k.name}
                            component={PageFactory}
                            initialParams={{
                                child: k
                            }}
                            options={{
                                ...(k.option || {})
                            }} />
                    })
                }
            </BottomTab.Navigator>
        }
        {
            Config.content && <Other params={Config.content.path} {...{ navigation, route }} />

        }
    </>
}

function Other({ params, navigation, route }) {
    const XX = ComMap.get(params);
    return <XX {...{ navigation, route }} />
}
function Home({ navigation }) {
    return (<TouchableHighlight onPress={() => {
        navigation.push("home", {
            child: applyKey(Configg2)
        })
    }}>
        <Text>Home</Text>
    </TouchableHighlight>)
}

function Third() {
    return (<TouchableHighlight>
        <Text>Third</Text>
    </TouchableHighlight>)
}

NameKey = 1;
function getKey() {
    const key = NameKey + 1;
    NameKey = key;
    console.log("key:" + key)
    return key + "|path";
}
function applyName(k) {
    if (!k) return;
    if (!k.name) {
        k.name = getKey();
    }
    if (k.bottomTabs) {
        if (!k.bottomTabs.name) {
            k.bottomTabs.name = getKey();
        }
        k.bottomTabs.child && applyKey(k.bottomTabs.child)
    }

    if (k.topTabs) {
        if (!k.topTabs.name) {
            k.topTabs.name = getKey();
        }
        k.topTabs.child && applyKey(k.topTabs.child)
    }

    if (k.content) {
        if (!k.content.name) {
            k.content.name = getKey();
        }
    }
}

function applyKey(obj) {
    if (Array.isArray(obj)) {
        obj.forEach(k => applyName(k))
    } else {
        applyName(obj)
    }
    return obj;
}

function Root() {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    );
}

const Configg2 = {
    topBar: null,
    topTabs: null,
    bottomTabs: {
        option: {},
        child: [
            {
                topBar: null,
                content: {
                    path: "third",
                    option: {
                    }
                },
                option: {
                    tabBarLabel: "topTabs2ss",
                }
            },
            {
                topBar: null,
                topTabs: {
                    option: {

                    },
                    child: [
                        {
                            topBar: null,
                            content: {
                                path: "third"
                            },
                            option: {
                                tabBarLabel: "topTabs1"
                            }
                        },
                        {
                            topBar: null,
                            content: {
                                path: "third"
                            },
                            option: {
                                tabBarLabel: "fast"
                            }
                        }
                    ]
                },
                option: {
                    tabBarLabel: "bottomTabs2"
                }
            }, {
                bottomTabs: {
                    option: {},
                    child: [
                        {
                            topBar: null,
                            content: {
                                path: "third",
                                option: {

                                }
                            },
                            option: {
                                tabBarLabel: "topTabs2ss"
                            }
                        },
                        {
                            topBar: null,
                            topTabs: {
                                option: {

                                },
                                child: [
                                    {
                                        topBar: null,
                                        content: {
                                            path: "third"
                                        },
                                        option: {
                                            tabBarLabel: "topTabs1"
                                        }
                                    },
                                    {
                                        topBar: null,
                                        content: {
                                            path: "home"
                                        },
                                        option: {
                                            tabBarLabel: "hello"
                                        }
                                    }
                                ]
                            },
                            option: {
                                tabBarLabel: "bottomTabs1"
                            }
                        }
                    ]
                },
                option: {
                    tabBarLabel: "bottomTabs3"
                }
            }
        ]
    },
    content: null
}


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);