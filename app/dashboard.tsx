import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { cerrarSesion, obtenerUsuario } from "../constants/storage";
import { typography } from "../constants/typography";

export default function DashboardScreen() {
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        async function cargarUsuario() {
            const data = await obtenerUsuario();
            setUsuario(data);
        }
        cargarUsuario();
    }, []);

    async function handleLogout() {
        await cerrarSesion();
        router.replace("/");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>DASHBOARD</Text>
            <Text style={styles.subtitle}>
                Bienvenido, {usuario?.nombre || "..."}
            </Text>
            <Text style={styles.rol}>Rol: {usuario?.rol}</Text>

            <TouchableOpacity
                style={styles.crearButton}
                onPress={() => router.push("/crear-ticket")}
            >
                <Text style={styles.crearButtonText}>+ Crear ticket</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.misTicketsButton}
                onPress={() => router.push("/mis-tickets")}
            >
                <Text style={styles.misTicketsButtonText}>Mis tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xxl,
    },
    subtitle: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
        marginTop: 8,
    },
    rol: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginTop: 4,
        marginBottom: 32,
    },
    crearButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 32,
        marginBottom: 12,
        width: "100%",
        alignItems: "center",
    },
    crearButtonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
    misTicketsButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 32,
        marginBottom: 16,
        width: "100%",
        alignItems: "center",
    },
    misTicketsButtonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
    button: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    buttonText: {
        color: colors.primary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
});