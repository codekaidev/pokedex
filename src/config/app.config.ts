export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV,
  mongodb: process.env.MONGODB,
  port: Number(process.env.PORT),
  defaultLimit: Number(process.env.DEFAULT_LIMIT),
});

/**
 * ? lo de arriba es igual a lo siguiente:
 */
// const EnvConfiguration = () => {
//     return {

//     }
// };
