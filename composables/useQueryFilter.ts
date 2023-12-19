const useQueryFilter = <T>(query: string, value: Ref<T | undefined>) => {
  const route = useRoute();
  const router = useRouter();
  watch(
    () => value.value,
    () => {
      // set query param
      router.push({
        query: {
          ...route.query,
          [query]:
            value.value !== undefined
              ? encodeURIComponent(JSON.stringify(value.value))
              : undefined,
        },
      });
    },
  );

  watch(
    () => route.query,
    () => {
      // set query param
      if (route.query[query] === undefined) {
        router.push({
          query: {
            ...route.query,
            [query]:
              value.value !== undefined
                ? encodeURIComponent(JSON.stringify(value.value))
                : undefined,
          },
        });
      } else {
        value.value = JSON.parse(
          decodeURIComponent(route.query[query]?.toString() || "") || "",
        );
      }
    },
    {
      immediate: true,
    },
  );
};

export default useQueryFilter;
