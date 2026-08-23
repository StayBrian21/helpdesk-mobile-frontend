import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "helpdesk_token";
const USER_KEY = "helpdesk_user";

export async function guardarSesion(token: string, usuario: object) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export async function obtenerToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function obtenerUsuario() {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

export async function cerrarSesion() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
}