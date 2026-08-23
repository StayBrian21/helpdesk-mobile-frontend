import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../../constants/api";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/typography";

const ESTADOS = [
    { value: "abierto", label: "Abierto", color: colors.estadoAbierto },
    { value: "en_progreso", label: "En progreso", color: colors.estadoEnProgreso },
    { value: "resuelto", label: "Resuelto", color: colors.estadoResuelto },
    { value: "cerrado", label: "Cerrado", color: colors.estadoCerrado },
];

export default function GestionarTicketScreen() {
    const { id } = useLocalSearchParams();
    const [ticket, setTicket] = useState<any>(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
    const [comentario, setComentario] = useState("");
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    async function cargarTicket() {
        try {
            const respuesta = await api.get(`/tickets/${id}`);
            setTicket(respuesta.data);
            setEstadoSeleccionado(respuesta.data.estado);
        } catch (error) {
            console.error("Error al cargar ticket:", error);
        } finally {
            setCargando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            cargarTicket();
        }, [id])
    );

    async function handleGuardar() {
        setGuardando(true);
        try {
            await api.put(`/tickets/${id}`, {
                estado: estadoSeleccionado,
                comentario,
            });

            Alert.alert("Ticket actualizado", "Los cambios se guardaron correctamente", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            const mensaje =
                error.response?.data?.mensaje || "No se pudo actualizar el ticket";
            Alert.alert("Error", mensaje);
        } finally {
            setGuardando(false);
        }
    }

    if (cargando || !ticket) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backButton}>{"< Regresar"}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>GESTIONAR TICKET</Text>
            <Text style={styles.subtitle}>{ticket.titulo}</Text>

            <Text style={styles.label}>Cambiar estado</Text>
            <View style={styles.estadoContainer}>
                {ESTADOS.map((e) => (
                    <TouchableOpacity
                        key={e.value}
                        style={[
                            styles.estadoChip,
                            {
                                borderColor: e.color,
                                backgroundColor:
                                    estadoSeleccionado === e.value ? e.color : "transparent",
                            },
                        ]}
                        onPress={() => setEstadoSeleccionado(e.value)}
                    >
                        <Text
                            style={[
                                styles.estadoChipText,
                                {
                                    color:
                                        estadoSeleccionado === e.value
                                            ? colors.textPrimary
                                            : e.color,
                                },
                            ]}
                        >
                            {e.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Comentario (opcional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej. Se reemplazó la pieza dañada"
                placeholderTextColor={colors.textMuted}
                value={comentario}
                onChangeText={setComentario}
                multiline
                numberOfLines={3}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleGuardar}
                disabled={guardando}
            >
                <Text style={styles.buttonText}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginBottom: 20,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xl,
    },
    subtitle: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
        marginBottom: 24,
    },
    label: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.xs,
        textTransform: "uppercase",
        marginBottom: 8,
    },
    estadoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 24,
    },
    estadoChip: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    estadoChipText: {
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
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
        height: 90,
        textAlignVertical: "top",
        marginBottom: 24,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
});