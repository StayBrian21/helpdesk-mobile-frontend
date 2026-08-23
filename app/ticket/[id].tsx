import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../../constants/api";
import { colors } from "../../constants/colors";
import { obtenerUsuario } from "../../constants/storage";
import { typography } from "../../constants/typography";

const COLOR_ESTADO: Record<string, string> = {
    abierto: colors.estadoAbierto,
    en_progreso: colors.estadoEnProgreso,
    resuelto: colors.estadoResuelto,
    cerrado: colors.estadoCerrado,
};

const COLOR_PRIORIDAD: Record<string, string> = {
    baja: colors.prioridadBaja,
    media: colors.prioridadMedia,
    alta: colors.prioridadAlta,
    critica: colors.prioridadCritica,
};

export default function DetalleTicketScreen() {
    const { id } = useLocalSearchParams();
    const [ticket, setTicket] = useState<any>(null);
    const [usuario, setUsuario] = useState<any>(null);
    const [cargando, setCargando] = useState(true);

    async function cargarDatos() {
        try {
            const [respTicket, dataUsuario] = await Promise.all([
                api.get(`/tickets/${id}`),
                obtenerUsuario(),
            ]);
            setTicket(respTicket.data);
            setUsuario(dataUsuario);
        } catch (error) {
            console.error("Error al cargar ticket:", error);
        } finally {
            setCargando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [id])
    );

    if (cargando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    if (!ticket) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>No se encontró el ticket</Text>
            </View>
        );
    }

    const esTecnico = usuario?.rol === "tecnico";

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backButton}>{"< Regresar"}</Text>
            </TouchableOpacity>

            <View style={styles.headerRow}>
                <Text style={styles.title}>{ticket.titulo}</Text>
                <View
                    style={[
                        styles.badge,
                        { backgroundColor: COLOR_PRIORIDAD[ticket.prioridad] },
                    ]}
                >
                    <Text style={styles.badgeText}>{ticket.prioridad}</Text>
                </View>
            </View>

            <View style={styles.estadoRow}>
                <View
                    style={[
                        styles.estadoDot,
                        { backgroundColor: COLOR_ESTADO[ticket.estado] },
                    ]}
                />
                <Text style={styles.estadoText}>
                    {ticket.estado.replace("_", " ").toUpperCase()}
                </Text>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <Text style={styles.value}>{ticket.descripcion}</Text>

            {ticket.categoria ? (
                <>
                    <Text style={styles.label}>Categoría</Text>
                    <Text style={styles.value}>{ticket.categoria}</Text>
                </>
            ) : null}

            {ticket.ubicacion ? (
                <>
                    <Text style={styles.label}>Ubicación</Text>
                    <Text style={styles.value}>{ticket.ubicacion}</Text>
                </>
            ) : null}

            <Text style={styles.label}>Reportado por</Text>
            <Text style={styles.value}>
                {ticket.creadoPor?.nombre} ({ticket.creadoPor?.email})
            </Text>

            {ticket.fotoUrl ? (
                <>
                    <Text style={styles.label}>Fotografía</Text>
                    <Image source={{ uri: ticket.fotoUrl }} style={styles.foto} />
                </>
            ) : null}

            <Text style={styles.label}>Historial</Text>
            {ticket.historial.map((h: any, index: number) => (
                <View key={index} style={styles.historialItem}>
                    <Text style={styles.historialEstado}>
                        {h.estadoNuevo.replace("_", " ").toUpperCase()}
                    </Text>
                    {h.comentario ? (
                        <Text style={styles.historialComentario}>{h.comentario}</Text>
                    ) : null}
                    <Text style={styles.historialFecha}>
                        {new Date(h.fecha).toLocaleString()}
                    </Text>
                </View>
            ))}

            {esTecnico && (
                <TouchableOpacity
                    style={styles.gestionarButton}
                    onPress={() => router.push(`/ticket/${id}/gestionar`)}
                >
                    <Text style={styles.gestionarButtonText}>Gestionar ticket</Text>
                </TouchableOpacity>
            )}
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
    errorText: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
    },
    backButton: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xl,
        flex: 1,
        marginRight: 12,
    },
    badge: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.xs,
        textTransform: "uppercase",
    },
    estadoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    estadoDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    estadoText: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
    },
    label: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.xs,
        textTransform: "uppercase",
        marginTop: 16,
        marginBottom: 4,
    },
    value: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
    },
    foto: {
        width: "100%",
        height: 220,
        borderRadius: 8,
        marginTop: 4,
    },
    historialItem: {
        backgroundColor: colors.surface,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
    },
    historialEstado: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.sm,
    },
    historialComentario: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    historialFecha: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.xs,
        marginTop: 4,
    },
    gestionarButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 24,
    },
    gestionarButtonText: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
    },
});