import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { api } from "./api";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registrarParaNotificaciones() {
    try {
        if (!Device.isDevice) {
            console.log("Las notificaciones push requieren un dispositivo físico");
            return;
        }

        const permisoActual = await Notifications.getPermissionsAsync();
        let estadoFinal = permisoActual.status;

        if (estadoFinal !== "granted") {
            const solicitud = await Notifications.requestPermissionsAsync();
            estadoFinal = solicitud.status;
        }

        if (estadoFinal !== "granted") {
            console.log("Permiso de notificaciones no concedido");
            return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const pushToken = tokenData.data;

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }

        await api.put("/auth/push-token", { pushToken });
        console.log("Token de notificaciones registrado en el backend");
    } catch (error) {
        console.log(
            "No se pudo registrar para notificaciones (normal en Expo Go, se probará en el build final):",
            error
        );
    }
}