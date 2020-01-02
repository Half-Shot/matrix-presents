<template>
  <div class="login-box">
    <h1>Login to Presents</h1>
    <p v-if=(this.error) class="error-box">
      <b> Error </b> {{ this.error }}
    </p>
    <form v-on:submit=this.onSubmit>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { discoverHomeserver, loginToMatrix } from "../util/matrix";

@Component
export default class Login extends Vue {
  private username: string = "";
  private password: string = "";
  private error: string|null = null;
  private specifyHs: boolean = false;
  private homeserver: string = "";
  private homeserverInvalid: boolean = false;
  private canLogin: boolean = false;

  private async onUsernameChange(ev: Event) {
    this.error = "";
    this.updateCanLogin();
    if (this.username === "" || this.specifyHs) {
      return;
    }

    const [localpart, domain] = this.username.split(":");
    if (!domain || localpart[0] !== "@") {
      return; // Not a mxid
    }
    // Otherwise, attempt a well known request.
    const wellKnownResult = await discoverHomeserver(domain);
    console.log(wellKnownResult);
    if (wellKnownResult.state === "SUCCESS") {
      this.homeserver = wellKnownResult.base_url;
    } else if (wellKnownResult.state === "FAIL_ERROR" || wellKnownResult.state === "FAIL_PROMPT") {
      this.error = `Failed to discover homeserver (${wellKnownResult.error}). Check homeserver configuration.`;
      this.homeserver = "";
    } else {
      console.log("Unknown wellknown state:", wellKnownResult);
      // Not sure how to handle this.
    }
    this.updateCanLogin();
  }

  private async onSubmit(ev: Event) {
    ev.preventDefault();
    try {
      const loginRes = loginToMatrix(this.homeserver, this.username, this.password);
      console.log(loginRes);
    } catch (ex) {
      console.error(ex);
    }
    // Do a login attempt.
  }

  private updateCanLogin() {
    this.canLogin = this.username.length > 0 && this.password.length > 0 && !this.homeserverInvalid && !!this.homeserver;
  }

  private async onToggleManualHs(ev: Event) {
    if (this.specifyHs) {
      this.error = null;
      this.updateCanLogin();
      return;
    }
    // Force re-evaluate.
    await this.onUsernameChange(ev);
  }
}



</script>