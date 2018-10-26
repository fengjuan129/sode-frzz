import LoadingComponent from '../components/Loading.vue';

// export default asyncComponent => {
//   const Com = () => ({
//     component: asyncComponent(),
//     loading: LoadingComponent,
//     delay: 0,
//   });
//   return {
//     render(h) {
//       return h(Com, {});
//     },
//   };
// };

export default asyncComponent => ({
  component: asyncComponent().default,
  loading: LoadingComponent,
  delay: 0,
});
