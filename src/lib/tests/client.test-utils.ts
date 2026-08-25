export const isUUID4 = (val: string | undefined) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof val === 'string' && regex.test(val);
};
