import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../constants/api";
import { colors } from "../constants/colors";
import { guardarSesion } from "../constants/storage";
import { typography } from "../constants/typography";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Campos incompletos", "Ingresa tu correo y contraseña");
            return;
        }

        setCargando(true);
        try {
            const respuesta = await api.post("/auth/login", { email, password });
            await guardarSesion(respuesta.data.token, respuesta.data.usuario);
            router.replace("/dashboard");
        } catch (error: any) {
            const mensaje =
                error.response?.data?.mensaje || "No se pudo iniciar sesión";
            Alert.alert("Error", mensaje);
        } finally {
            setCargando(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>HELPDESK MOBILE</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={cargando}
                >
                    <Text style={styles.buttonText}>
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xxl,
        textAlign: "center",
    },
    subtitle: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 40,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
});