import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "../constants/api";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

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

export default function MisTicketsScreen() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    async function cargarTickets() {
        try {
            const respuesta = await api.get("/tickets");
            setTickets(respuesta.data);
        } catch (error) {
            console.error("Error al cargar tickets:", error);
        } finally {
            setCargando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            cargarTickets();
        }, [])
    );

    function renderTicket({ item }: { item: any }) {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/ticket/${item._id}` as any)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitulo} numberOfLines={1}>
                        {item.titulo}
                    </Text>
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: COLOR_PRIORIDAD[item.prioridad] },
                        ]}
                    >
                        <Text style={styles.badgeText}>{item.prioridad}</Text>
                    </View>
                </View>

                <Text style={styles.cardDescripcion} numberOfLines={2}>
                    {item.descripcion}
                </Text>

                <View style={styles.cardFooter}>
                    <View
                        style={[
                            styles.estadoDot,
                            { backgroundColor: COLOR_ESTADO[item.estado] },
                        ]}
                    />
                    <Text style={styles.cardEstado}>
                        {item.estado.replace("_", " ")}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>{"< Regresar"}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>MIS TICKETS</Text>

            <FlatList
                data={tickets}
                keyExtractor={(item) => item._id}
                renderItem={renderTicket}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={cargando}
                        onRefresh={cargarTickets}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    !cargando ? (
                        <Text style={styles.emptyText}>
                            No tienes tickets registrados todavía
                        </Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    headerRow: {
        marginBottom: 12,
    },
    backButton: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
    },
    title: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.heading,
        fontSize: typography.size.xl,
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitulo: {
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bodyBold,
        fontSize: typography.size.md,
        flex: 1,
        marginRight: 8,
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
    cardDescripcion: {
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.sm,
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
    },
    estadoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    cardEstado: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.xs,
        textTransform: "capitalize",
    },
    emptyText: {
        color: colors.textMuted,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.size.md,
        textAlign: "center",
        marginTop: 60,
    },
});