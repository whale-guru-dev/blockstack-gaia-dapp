<template>
  <div class="panel-landing text-center" id="section-1">
    <h1 class="landing-heading">Hello, Blockstack!</h1>
    <p class="lead">
      <a
        href="#"
        class="btn btn-primary btn-lg"
        id="signin-button"
        @click.prevent="signIn"
      >
        Sign In with Blockstack
      </a>
    </p>
  </div>
</template>

<script>
import { userSession } from '../userSession'
export default {
  name: 'signin',
  methods: {
    signIn () {
      userSession.redirectToSignIn()
    }
  }
}
</script>

<style lang="scss">
body {
  color: #3700FF;
  text-align: center;
}

.btn-primary {
  background-color: #3700FF;
  border: 1px solid #3700FF;
}

html, body {
  height: 100%;
  background-color: #F4F4FC;
}
</style>
