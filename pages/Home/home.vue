<template>
  <div class="tpl-home">
    <Intro/>
    <!-- <img :src="require(`../../static/images/${datas.projects[0].image}`)" alt=""> -->
      <div class="title-container">
        <transition name="names" duration="10000">
          <h2 ref="title" v-html="title" v-show="introEnded && !scrollBegin"></h2>
        </transition>
        <!-- <transition name="link" duration="10000"> -->
          <div class="dates" :class="introEnded && !scrollBegin ? 'show' : ''" >Les 24, 25, et 26 Juin 2022</div>
        <!-- </transition> -->
      </div>
      
       <transition name="link" duration="10000">
          <a href="" ref="link" class="main-link" v-show="showLink">CLICK THAT LINK MOFO</a>
      </transition>
      <transition name="link" duration="10000">
        <div v-show="introEnded && !scrollBegin" class="scroll-cta">scroll that pineapple</div>
      </transition>
  </div>
</template>

<script>
import './home.less'
import Bowser from 'bowser'
import gsap from 'gsap'
import {Texture, Plane, Mesh, Program, Vec2, TextureLoader, Geometry }  from 'ogl'
import Emitter from 'event-emitter'
import Data from '@/assets/data/data.json'
import beam from '@/static/objects/beam.json'
import mutant from '@/static/objects/mutant2.json'
import mutantText from '@/static/images/texture/mutant.png'
import SplitText from '../../assets/js/_libs/greensock/SplitText'

//SHADERS
import tagfrag2 from '@/static/shaders/tag2.frag'
import tagvert2 from '@/static/shaders/tag2.vert'
import tagfrag1 from '@/static/shaders/tag1.frag'
import tagvert1 from '@/static/shaders/tag1.vert'

import planeFrag from '@/static/shaders/plane.frag'
import planeVert from '@/static/shaders/plane.vert'

import beamFrag from '@/static/shaders/beam.frag'
import beamVert from '@/static/shaders/beam.vert'


const vertexNull = /* glsl */ `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentNull = /* glsl */ `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
        gl_FragColor.rgb = vec3(0.);
        gl_FragColor.a = 0.;
    }
`

export default {
  name: 'Home',
  data(){
    return {
      datas: Data,
      time: 0,
      meshes: [],
      beamsNum: 10,
      beamsArray: [],
      scrollBegin: false,
      scrollTarget: 0,
      scroll: 0,
      rotation: 0,
      rotationZ: 0,
      startRotation: 0,
      originalPosition: -30,
      position: -30,
      maxScroll: 10000,
      showLink: false,
      introEnded: false,
      val: 0,
      title:"<span>The</span></br><span class='title'>Furidays</span>"
    }
  },
  mounted() {
      import('../../assets/js/Raf').then((el) => {
      this.Raf = el.default
      this.Raf.suscribe('webgl', this.update.bind(this))
    })
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.initOgl()
    window.addEventListener('wheel', this.scrollListen.bind(this), false, false)
    import('../../assets/js/mouse').then((el) => {
      this.Mouse = el.default
      this.Mouse.on('drag', (e) => {
        this.scrollListen(e)
      })

    })
    this.isMobile = Bowser.getParser(window.navigator.userAgent).parsedResult.platform.type !== 'desktop'
    this.split()
    // this.appear()
  },
  methods: {
    split() {
      this.$refs.title.split = new SplitText(this.$refs.title, {type: 'chars', charsClass:"char"} )
        this.$refs.title.querySelectorAll('span').forEach(el => {
          el.querySelectorAll('div').forEach((elm,i) => {
               elm.style.transitionDelay = i * 0.05 + 's'
          })
        })
    },
    initOgl() {
       import('../../assets/js/mainScene').then((el) => {
        this.Scene = el.default
        this.Scene.init()
        this.Scene.resume()
        // this.initOgl()
        requestAnimationFrame(() => {
          this.initBackground()
          // this.initTexts()
          this.initNull()
          this.drawJson(mutant, 'mutant', mutantText)
          this.generatBeams(beam)
        })
      })
    },

    initNull () {
      const program = new Program(this.Scene.gl, {
        vertex: vertexNull,
        fragment: fragmentNull,
        cullFace: null,
        transparent: true
      })
      const geometry = new Plane(this.Scene.gl)
      this.null = new Mesh(this.Scene.gl, { geometry, program })
      this.null.position.set(0, 0, this.originalPosition)
      this.null.setParent(this.Scene.scene)
    },

    initBackground(){
      // this.texture2 = new Texture(this.Scene.gl)
      const ratio = window.innerHeight / window.innerWidth
      let program = new Program(this.Scene.gl, {
        vertex: planeVert,
        fragment: planeFrag,
        cullFace: false,
        transparent: true,
        uniforms: {
          progress: { value: 1 },
          u_mapResolution: {
            value: new Vec2(window.innerWidth, window.innerHeight)
          },
          u_resolution: {
            value: new Vec2(window.innerWidth, window.innerHeight)
          },
          uOpacity: {
            value: 0
          },
          uNormalScale: { value: 2 },
          uNormalUVScale: { value: 1 },
          uGold: { value: 0 },
          uTime: {
            value: this.time
          }
        }
      })
      let geometry = new Plane(this.Scene.gl)

      let mesh = new Mesh(this.Scene.gl, {
        geometry,
        program
      })
      mesh.initTime = Math.random() * 30
      // mesh.position.set(0, 0, -0.207)
      mesh.position.set(0, 0, -35)
      mesh.rotation.set(0, 0, 0)
      mesh.scale.set(50, 50, 0)
      mesh.setParent(this.Scene.scene)
      this.background = mesh
      this.emitter.emit('plane-created')
      mesh = null
      program = null
      geometry = null
    },
    
    drawJson (data, name, text, norm) {
    this.texture = new Texture(this.Scene.gl)
    let img = new Image()
      img.src = require('../../static/images/texture/map.png')
      img.onload = () => {
        this.texture.image = img
      }
    this.vert = this.Scene.gl.renderer.isWebgl2 ? tagvert2 : tagvert1
    if (norm) {const normalTex = TextureLoader.load(this.Scene.gl, { src: name === 'vigne' ? normal1 : normal4 })}
    let program = new Program(this.Scene.gl, {
      vertex: this.vert,
      fragment: this.Scene.gl.renderer.isWebgl2 ? tagfrag2 : tagfrag1,
      cullFace: true,
      transparent: false,
      uniforms: {
        tMap: {
          value: this.texture
        },
        uOpacity: {
          value: 1
        },
        uTime: {
          value: this.time
        }
      }
    })
    let geometry = new Geometry(this.Scene.gl, {
      position: {
        size: 3,
        data: new Float32Array(data.verts)
      },
      uv: {
        size: 2,
        data: new Float32Array(data.texcoords)
      },
      normal: {
        size: 3,
        data: new Float32Array(data.normals)
      }
    })

    let mesh = new Mesh(this.Scene.gl, {
      geometry,
      program
    })
    mesh.position.set(0, 0, this.originalPosition)
    mesh.rotation.set(0, 0, 0)
    mesh.scale.set(1, 1, 1)
    mesh.setParent(this.Scene.scene)
    this.discoAnanas = mesh
    // this.meshes.push(this[name])
    mesh = null
    program = null
    geometry = null
    
  },
  generatBeams (data) {
    for (let i = 0; i < this.beamsNum; i++) {
      let program = new Program(this.Scene.gl, {
      vertex: beamVert,
      fragment: beamFrag,
      cullFace: true,
      transparent: true,
      uniforms: {
        uTime: {
          value: this.time
        }
      }
    })
    let geometry = new Geometry(this.Scene.gl, {
      position: {
        size: 3,
        data: new Float32Array(data.verts)
      },
      uv: {
        size: 2,
        data: new Float32Array(data.texcoords)
      },
      normal: {
        size: 3,
        data: new Float32Array(data.normals)
      }
    })

    let mesh = new Mesh(this.Scene.gl, {
      geometry,
      program
    })
    mesh.position.set(0, 0, 0)
    mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
    mesh.scale.set(2, window.innerWidth / window.innerHeight, 2 )
    mesh.setParent(this.null)
    // this.beamsArray.push(mesh)
    
    // this.meshes.push(this[name])
    mesh = null
    program = null
    geometry = null
      
    }
  },
  scrollListen (e) {
    if(!this.introEnded) return
    if (e && this.isMobile ) {
        if(e.dragedVal){
          console.log(e.velocity[1])
          this.scrollTarget += -e.velocity[1] * 1000
        }
    } else { this.scrollTarget += e.deltaY }
    if (this.scrollTarget <= 0) {
      this.scroll = 0
      this.scrollTarget = 0
      this.scrollBegin = false
    } else {
      this.scrollBegin = true
    }
    this.showLink = this.scroll > this.maxScroll
  },
  clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  },
  appear() {
    gsap.fromTo(this, {position: -30}, {position: 0, duration: 5,
    onUpdate: () => {
      this.originalPosition = this.position
    },
    onComplete: () => {
      this.introEnded = true
    }})
  },
  update() {
    this.time++
    let tmp = this.scrollTarget - this.scroll
    tmp *= 0.1
    this.scroll += tmp
    // console.log(this.scroll)
    if(this.background) {
      this.background.program.uniforms.uTime.value = this.time * 0.01
    }
    if(this.discoAnanas) {
      this.discoAnanas.program.uniforms.uTime.value = this.time * 0.01

      if(!this.scrollBegin) {
        this.val++
        this.rotation =  (this.val *  0.01) % (Math.PI * 2)
        this.rotationZ =  Math.sin(this.val * 0.005) * 0.5
        this.startRotation = this.rotation
        this.startZRotation = this.rotationZ
        // if(this.startRotation < Math.PI && this.startRotation > (Math.PI/2)) {
        //   this.scroll = 0
        //   this.bound = Math.PI - this.rotation
        //   this.way = +1
        //   this.toZero = false
        //   console.log(1)
        // } else if (this.startRotation < (3*Math.PI/2) && this.startRotation > (Math.PI)) {
        //   this.scroll = 0
        //   this.bound = Math.PI - this.rotation
        //   this.way = -1
        //   this.toZero = false
        //   console.log(2)
        // } else {
          
        //   console.log(3)
        // }
        this.scroll = 0
        this.bound = 1000
        this.way = -1
        this.toZero = true
        this.delta = this.startZRotation > 0 ? -1 : 1
      } else {
        //this.rotation = this.clamp(this.startRotation  - this.way * this.scroll * 0.01, 0, this.bound)
      
        this.rotation = this.clamp(this.startRotation  - this.scroll * 0.001, 0, 100000)
        

        this.rotation = this.clamp(this.startRotation  - this.scroll * 0.001, 0, 10000)
        // console.log(this.startZRotation)
        this.rotationZ = this.clamp(this.startZRotation + this.delta * this.scroll * 0.00004, this.delta === -1 ? 0 : -1000,  this.delta === 1 ? 0 : 1000)
        this.position = this.originalPosition + this.scroll * 0.001
      }

      this.discoAnanas.rotation.y = this.rotation
      this.discoAnanas.rotation.z = this.rotationZ
      this.null.rotation.y = Math.sin(this.time * 0.01) * 0.5
      this.null.rotation.z = Math.sin(this.time * 0.01) * 0.5

      this.discoAnanas.position.z = this.position
      this.null.position.z = this.position

      // this.discoAnanas.rotation.x = this.discoAnanas.rotation.x + 0.01
      // this.null.rotation.x = this.null.rotation.x + 0.01
    }
  }
  }
}
</script>
