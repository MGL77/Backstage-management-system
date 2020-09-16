<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
</script>

<style scoped>
.about {
  width: 100%;
  height: 678px;
  background: #b79891; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #94716b,
    #b79891
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #94716b,
    #b79891
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
h1 {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
  overflow: hidden;
  font-size: 30px;
  font-style: oblique;
  font-weight: bold;
  text-align: center;
  background-image: -webkit-linear-gradient(
    left,
    rgb(29, 88, 29),
    rgb(238, 238, 57),
    pink,
    rgb(5, 62, 109),
    rgb(172, 41, 41) 25%,
    rgb(48, 145, 48) 35%,
    rgb(77, 77, 156) 50%,
    rgb(165, 165, 3) 60%,
    rgb(112, 60, 60) 75%,
    pink 85%,
    rgb(35, 35, 63) 100%
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  animation: stream 15s infinite linear;
  background-size: 200% 100%;
}
@keyframes stream {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
* {
  margin: 0;
  padding: 0;
}
</style>