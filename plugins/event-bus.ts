// import mitt from 'mitt';

// type Events = {
//   'profile-updated': void;
// };

// const emitter = mitt<Events>();

// export default emitter;

import mitt from 'mitt'

type Events = {
  'profile-updated': void
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<Events>()
  return {
    provide: {
      emitter
    }
  }
})
