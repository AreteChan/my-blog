<script setup>
import { reactive, watch, onUpdated } from 'vue'
import debounceRef from '@/utils/debounceRef.js'

const amount = debounceRef(Number(localStorage.getItem('amount') || 5), 1000),
     firstId = debounceRef(Number(localStorage.getItem('firstId') || 1), 1000)

const pokemons = reactive([])

const colors = {
        fire: '#ff927d',
        grass: '#bdffa3',
        electric: '#ffcc33',
        water: '#77bbff',
        ground: '#f1dda0',
        rock: '#e1d08c',
        fairy: '#fbcbfb',
        poison: '#c689ba',
        bug: '#daec44',
        dragon: '#a194ff',
        psychic: '#ff9cc4',
        flying: '#99bbff',
        fighting: '#dd9988',
        normal: '#e7e7d8',
        ghost: '#9f9fec',
        steel: '#dfdfe1',
        ice: '#dbf6ff',
        dark: '#bda396',
      }

function getPokemon(i) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then(res => res.json())
    .then(res => { pokemons.push(res) })
}

watch(amount, (newValue, oldValue) => {
  if (newValue > 100) amount.value = 100
  if (newValue < 1) amount.value = 1
  if (newValue + firstId.value -1 > 898) {alert('超出宝可梦总数898！'); amount.value = oldValue}
  else {
    if (newValue > oldValue) {
      for (let i = firstId.value + oldValue; i < firstId.value + newValue; i++) {
        getPokemon(i)
      }
    } else {
      pokemons.splice(newValue)
    }
  }
  localStorage.setItem('amount', amount.value)
})

watch(firstId, (newValue, oldValue) => {
  if (newValue < 1) firstId.value = 1
  if (newValue + amount.value -1 > 898) {alert('超出宝可梦总数898！'); firstId.value = oldValue}
  else {
    pokemons.splice(0)
    for (let i = newValue; i < newValue + amount.value; i++) {
      getPokemon(i)
    }
  }
  localStorage.setItem('firstId', firstId.value)
})

// 初始化pokemon
for (let i = firstId.value; i < firstId.value + amount.value; i++) {
  getPokemon(i)
}

// 排序
onUpdated(() => pokemons.sort((a, b) => a.id - b.id)) 

</script>

<template>
  <img src="@/assets/pokeapi.png">
  <div id="number">
    <div class="num-container">
      <label for="firstId">First id: </label>
      <input type="number" id="firstId" min="1" :value="firstId" @change="firstId = Math.trunc($event.target.value)">
    </div>
    <div class="num-container">
      <label for="amount">Amount: </label>
      <input type="number" id="amount" min="1" max="100" :value="amount" @change="amount = Math.trunc($event.target.value)">
    </div>
  </div>
  <div id="List">
    <div class="border" v-for="pokemon in pokemons" :key="pokemon.id">
      <div class="item" :style="{backgroundColor: colors[pokemon.types[0].type.name]}">
        <div class="img-container">
          <img class="avatar" :src="pokemon.sprites.front_default">
        </div>
        <div class="pokemonID">#{{pokemon.id.toString().padStart(3, '0')}}</div>
        <h3>{{pokemon.name}}</h3>
        <small>type: {{pokemon.types[0].type.name}}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  display: block;
  margin: 20px auto;
}

#number {
  display: flex;
  justify-content: center;
  align-items: center;
}
.num-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 161px;
  padding: 0 10px 0 30px;
  height: 50px;
  background-color: white;
  border-radius: 25px;
  overflow: hidden;
  margin: 10px;
  font-size: 17px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
}

input {
  width: 50px;
  border: 0;
  color: #0074ec;
  border-radius: 8px;
  text-align: center;
  outline: 0;
}

#List {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.border {
  margin: 15px;
  background: white;
  width: 196px;
  height: 286px;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2),
              -2px -2px 5px rgba(0, 0, 0, 0.2) inset;
}
.item {
  background-color: #ffcc33;
  width: 180px;
  height: 270px;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}
.img-container {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin: auto;
}
.avatar {
  width: 100%;
  margin-top: 0px;
  margin-left: 0px;
}
.pokemonID {
  font-size: 12px;
  margin: 15px auto;
  padding: 5px 10px;
  border-radius: 10px;
  width: fit-content;
  background: rgba(0, 0, 0, 0.1);
}
h3 {
  white-space:nowrap;
  margin: 10px 0;
}
</style>