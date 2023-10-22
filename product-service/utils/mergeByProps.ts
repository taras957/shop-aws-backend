type ArrayObject = { [key: string]: unknown };

type MergeByProp<T extends ArrayObject, K extends ArrayObject> = {
  [P in keyof T]: P extends keyof K ? K[P] : T[P];
};

export const mergeByProp = <T extends ArrayObject, K extends ArrayObject>(
  leftList: T[],
  rightList: K[],
  leftProp: string,
  rightProp: string
) => {
  const rightListMap: Record<string, K> = rightList.reduce((acc, item) => {
    if (item[rightProp] !== undefined) {
      acc[String(item[rightProp])] = item;
    }
    return acc;
  }, {});

  return leftList.map((item) => ({
    ...item,
    ...rightListMap[String(item[leftProp])],
  })) as MergeByProp<T, K>[];
};
