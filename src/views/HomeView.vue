<template>
  <div class="container">
    <img alt="Vue logo" src="../assets/dgii_logo.png" />

    <div class="columns mt-6">
      <div class="column is-8 is-offset-2">
        <section>
          <h1 class="title mb-6">Lista de contribuyentes</h1>
          <b-table :data="contribuyentes">
            <b-table-column
              field="contribuyenteId"
              label="ID"
              width="40"
              v-slot="props"
              centered
            >
              {{ props.row.contribuyenteId }}
            </b-table-column>

            <b-table-column
              field="nombre"
              label="Nombre"
              width="40"
              v-slot="props"
              centered
            >
              {{ props.row.nombre }}
            </b-table-column>

            <b-table-column
              field="tipo"
              label="Tipo"
              width="40"
              v-slot="props"
              centered
            >
              {{ props.row.tipo }}
            </b-table-column>

            <b-table-column
              field="rncCedula"
              label="RNC o Cedula"
              width="40"
              v-slot="props"
              centered
            >
              {{ props.row.rncCedula }}
            </b-table-column>

            <b-table-column
              field="estatus"
              label="Estatus"
              width="40"
              v-slot="props"
              centered
            >
              {{ props.row.estatus }}
            </b-table-column>

            <b-table-column label="accion" width="40" v-slot="props" centered>
              <b-button
                class="is-warning"
                @click="getComprobantes(props.row.rncCedula)"
              >
                Ver comprobantes fiscales
              </b-button>
            </b-table-column>

            <template #empty>
              <div class="has-text-centered">No contribuyentes</div>
            </template>
          </b-table>
        </section>

        <section>
          <b-modal v-model="isImageModalActive">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Lista de comprobantes fiscales por contribuyente:
                  <span v-if="contribuyente">{{
                    contribuyente.rncCedula
                  }}</span>
                </p>
                <button class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </header>
              <div class="card-content">
                <section class="mt-2" v-if="contribuyente">
                  <div class="columns">
                    <div class="column">
                      <p class="has-text-weight-bold">Nombre:</p>
                      <span>{{ contribuyente.nombre }}</span>
                    </div>
                    <div class="column">
                      <p class="has-text-weight-bold">RNC o Cedula:</p>
                      <span>{{ contribuyente.rncCedula }}</span>
                    </div>
                    <div class="column">
                      <p class="has-text-weight-bold">Tipo:</p>
                      <span>{{ contribuyente.tipo }}</span>
                    </div>
                    <div class="column">
                      <p class="has-text-weight-bold">Estatus:</p>
                      <span>{{ contribuyente.estatus }}</span>
                    </div>
                  </div>
                </section>
                <section class="mt-5">
                  <b-table :data="comprobantes">
                    <b-table-column
                      field="comprobanteFiscalId"
                      label="ID"
                      width="40"
                      v-slot="props"
                      centered
                    >
                      {{ props.row.comprobanteFiscalId }}
                    </b-table-column>

                    <b-table-column
                      field="rncCedula"
                      label="RNC o Cedula"
                      width="40"
                      v-slot="props"
                      centered
                    >
                      {{ props.row.rncCedula }}
                    </b-table-column>

                    <b-table-column
                      field="ncf"
                      label="NCF"
                      width="40"
                      v-slot="props"
                      centered
                    >
                      {{ props.row.ncf }}
                    </b-table-column>

                    <b-table-column
                      field="monto"
                      label="Monto"
                      width="40"
                      v-slot="props"
                      centered
                    >
                      {{ props.row.monto | currency }}
                    </b-table-column>

                    <b-table-column
                      field="itbis18"
                      label="Itbis"
                      width="40"
                      v-slot="props"
                      centered
                    >
                      {{ props.row.itbis18 | currency }}
                    </b-table-column>

                    <template #empty>
                      <div class="has-text-centered">
                        No hay comprobantes fiscales
                      </div>
                    </template>
                  </b-table>
                </section>
                <section class="mt-5">
                  <p>
                    <strong>Total montos:</strong> {{ montoTotal | currency }}
                  </p>
                  <p>
                    <strong>Total itbis:</strong> {{ itbisTotal | currency }}
                  </p>
                </section>
              </div>
            </div>
          </b-modal>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {},
})
export default class HomeView extends Vue {
  [x: string]: any;
  contribuyentes: [] = [];
  isImageModalActive: boolean = false;
  contribuyente: any = null;
  comprobantes: [] = [];
  montoTotal: number = 0;
  itbisTotal: number = 0;

  async mounted() {
    const response = await axios.get(
      "https://localhost:44343/api/Contribuyentes"
    );
    this.contribuyentes = response.data;
  }

  async getComprobantes(rncCedula: string) {
    this.comprobantes = [];
    this.montoTotal = 0;
    this.itbisTotal = 0;
    this.isImageModalActive = true;

    const response = await axios.post(
      `https://localhost:44343/api/ComprobantesFiscales/GetComprobantesFiscalesByRncCedula/${rncCedula}`
    );
    if (typeof response.data === "string") return;
    this.comprobantes = response.data;
    this.contribuyente = this.contribuyentes.find(
      (x: any) => x.rncCedula == rncCedula
    );
    this.itbisTotal = this.comprobantes.reduce(
      (prev, cur: any) => prev + cur.itbis18,
      0
    );
    this.montoTotal = this.comprobantes.reduce(
      (prev, cur: any) => prev + cur.monto,
      0
    );
    this.isImageModalActive = true;
  }
}
</script>
