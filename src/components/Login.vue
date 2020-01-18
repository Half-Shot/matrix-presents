<template>
  <div class="login-box">
    <h1>Login to Presents</h1>
    <p v-if=loginInProgress class="info-box">
      Logging in..
    </p>
    <p v-if=error class="error-box">
      <b> Error </b> {{ this.error }}
    </p>
    <form @submit=onSubmit>
      <div>
        <label for="username">
          Username
        </label>
        <input v-on:change=this.onUsernameChange type="text" name="username" placeholder="@foobar:example.com" v-model="username"/>
      </div>
      <div>
        <label for="password">
          Password
        </label>
        <input type="password" name="password" v-model="password"/>
      </div>
      <div>
        <label for="specify-homeserver">
          Specify homeserver
        </label>
        <input v-on:change=this.onToggleManualHs type="checkbox" name="specify-homeserver" v-model="specifyHs"/>
      </div>
      <div>
        <label for="homeserver">
          Homeserver URL
        </label>
        <input v-if=specifyHs type="text" name="homeserver" v-model="homeserver"/>
        <code v-else>{{ homeserver }}</code>
      </div>
      <input :disabled=!canLogin type="submit" value="Login"/>
    </form>
  </div> 
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

form {
  div {
    display: block;
    margin-top: 20px;
  }

  input {
    float: right;
    text-align: left;
  }

  code {
    float: right;
  }

  input[type=submit] {
    margin-top: 5px;
    display: block;
    float: right;
  }
}

.error-box {
  float:left;
  display: block;
  width: 100%;
}

.login-box {
  width: 20vw;
  padding: 20vh 40vw;
  position: relative;
  text-align: left;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { discoverHomeserver, loginToMatrix, logoutClient, createGlobalClient } from "../util/matrix";
import { AutoDiscoveryError } from "matrix-js-sdk";
import store from '../util/store';

@Component
export default class Login extends Vue {
  private username: string = "";
  private password: string = "";
  private error: string|null = null;
  private specifyHs: boolean = false;
  private wellKnownError: string|null = null;
  private homeserver: string = "";
  private loginInProgress: boolean = false;

  private get canLogin() {
    return this.validateForm().length === 0 && !this.loginInProgress;
  }

  private validateForm() {
    const errors: string[] = [];
    if (!this.username) {
      errors.push("Username field is empty");
    }

    if (!this.password) {
      errors.push("Password field is empty");
    }

    if (!this.homeserver) {
      errors.push("Not homeserver given");
    }

    if (this.wellKnownError) {
      errors.push(`Failed to discover homeserver (${this.wellKnownError}). Check homeserver configuration.`);
    }

    if (!this.homeserver) {
      errors.push("Homeserver not given");
    } else if (!this.homeserver.startsWith("http")) {
      errors.push("Homeserver does not start with http(s)://");
    }


    if (errors.length) {
      console.log("Cannot login:", errors);
    }

    return errors;
  }

  private async onUsernameChange(ev: Event) {
    if (this.username === "" || this.specifyHs) {
      return;
    }

    const [localpart, domain] = this.username.split(":");
    if (!domain || localpart[0] !== "@") {
      return; // Not a mxid
    }
    this.wellKnownError = null;
    // Otherwise, attempt a well known request.
    const wellKnownResult = await discoverHomeserver(domain);
    if (wellKnownResult.state === "SUCCESS") {
      this.homeserver = wellKnownResult.url;
    } else if (wellKnownResult.state === "FAIL_ERROR" || wellKnownResult.state === "FAIL_PROMPT") {
      this.wellKnownError = wellKnownResult.error as AutoDiscoveryError;
    } else {
      // Not sure how to handle this.
      console.log("Unknown wellknown state:", wellKnownResult);
    }
  }

  private async onSubmit(ev: Event) {
    this.error = null;
    this.loginInProgress = true;
    ev.preventDefault();
    try {
      const loginRes = await loginToMatrix(this.homeserver, this.username, this.password);
      // Success!
      await logoutClient();
      store.accessToken = loginRes.access_token;
      store.userId = loginRes.user_id;
      store.homeserver = this.homeserver;
      store.deviceId = loginRes.device_id;
      store.isGuest = false;
      // XXX: hack to force the client to be re setup
      window.location = window.location.origin;
    } catch (ex) {
      this.error = `Failed to login: ${ex.message}`;
      console.error(ex);
      this.loginInProgress = false;
    }
  }

  private async onToggleManualHs(ev: Event) {
    if (this.specifyHs) {
      this.wellKnownError = null;
      return;
    }
    // Force re-evaluate.
    await this.onUsernameChange(ev);
  }
}
</script>