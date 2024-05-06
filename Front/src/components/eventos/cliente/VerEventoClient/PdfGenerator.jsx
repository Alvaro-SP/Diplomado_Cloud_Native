import React from "react";
import { PDFViewer, Document, Page, View, Text } from "@react-pdf/renderer";

function PdfGenerator({ dataTabla, purchaseInfo }) {
  return (
    <PDFViewer>
      <Document>
        <Page>
          <View>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Confirmacion Y Finalizacion
            </Text>
            {/* Tabla de asientos */}
            <View style={{ marginBottom: 20 }}>
              <Text>
                Sección Fila Asiento Opciones Precio por boleto Tarifas de
                servicios
              </Text>
              {dataTabla.map((row, index) => (
                <Text key={index}>
                  Ultra-Premium {row.row} {row.seat} ${row.precio} $
                  {row.tarifas}
                </Text>
              ))}
              <Text>Total ${/* aquí coloca el total */}</Text>
            </View>
            {/* Tabla de resumen de compra */}
            <View>
              <Text>Descripción Detalle</Text>
              <Text>
                Listado de Asientos Seleccionados{" "}
                {purchaseInfo.selectedSeats.join(", ")}
              </Text>
              <Text>Nombre del Cliente {purchaseInfo.customerName}</Text>
              <Text>Información del Evento {purchaseInfo.eventInfo}</Text>
              <Text>Precio de la Localidad ${purchaseInfo.ticketPrice}</Text>
              <Text>Datos de la Tarjeta {purchaseInfo.cardInfo}</Text>
              <Text>Total a Pagar ${purchaseInfo.totalAmount}</Text>
            </View>
            <Text onClick={() => showtoast("Pedido Finalizado!")}>
              Finalizar Compra
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default PdfGenerator;
