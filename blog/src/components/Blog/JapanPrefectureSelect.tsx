import type { japanPrefectures } from '@/data/japanPrefectureVisits';
import { useCallback, useSyncExternalStore } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Prefecture = (typeof japanPrefectures)[number];

interface Props {
  id: string;
  placeholder: string;
  clearLabel: string;
  groups: {
    region: Prefecture['region'];
    label: string;
    options: (Pick<Prefecture, 'code' | 'visited'> & { label: string })[];
  }[];
}

const clearValue = 'clear';

export default function JapanPrefectureSelect({ id, placeholder, clearLabel, groups }: Props) {
  const getMap = useCallback(() => document.getElementById(id)?.closest<HTMLElement>('japan-prefecture-visits'), [id]);
  const subscribe = useCallback((onChange: () => void) => {
    const map = getMap();
    if (!map)
      return () => {};

    const observer = new MutationObserver(onChange);
    observer.observe(map, { attributeFilter: ['data-ready', 'data-filter', 'data-selected'] });
    return () => observer.disconnect();
  }, [getMap]);

  const selection = useSyncExternalStore(subscribe, () => {
    const map = getMap();
    return map?.dataset.ready === 'true' ? `${map.dataset.filter}:${map.dataset.selected ?? ''}` : '';
  }, () => '');
  const [filter, value = ''] = selection.split(':');

  const choose = (code: string) => {
    getMap()?.dispatchEvent(new CustomEvent('prefecture-change', {
      detail: code === clearValue ? '' : code,
    }));
  };

  return (
    <Select disabled={!selection} value={value} onValueChange={choose}>
      <SelectTrigger
        id={id}
        aria-label={undefined}
        aria-labelledby={`${id}-label`}
        className="min-h-11 rounded-lg data-[placeholder]:text-muted-foreground"
        data-testid="japan-visits-prefecture-select"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        aria-labelledby={`${id}-label`}
        className="max-h-[min(22rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)]"
      >
        {value && (
          <>
            <SelectItem value={clearValue} className="min-h-9 text-muted-foreground" data-testid="japan-visits-prefecture-clear">
              {clearLabel}
            </SelectItem>
            <SelectSeparator />
          </>
        )}
        {groups.map(({ region, label, options }) => {
          const visibleOptions = options.filter(({ visited }) => filter === 'all' || filter === (visited ? 'visited' : 'unvisited'));
          if (!visibleOptions.length)
            return null;
          return (
            <SelectGroup key={region}>
              <SelectLabel className="text-xs text-muted-foreground">{label}</SelectLabel>
              {visibleOptions.map((option) => (
                <SelectItem
                  key={option.code}
                  value={option.code}
                  className="min-h-9 pointer-coarse:min-h-11"
                  data-testid={`japan-visits-prefecture-option-${option.code}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
