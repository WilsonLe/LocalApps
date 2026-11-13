import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@localapps/ui/tabs';
import { Film, PanelsTopLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';
import type { ProjectTabsProps } from './ProjectTabs';

const projectViews = ['editor', 'storyboard'] as const;

const Tooltip = lazy(() =>
  import('@localapps/ui/tooltip').then(({ Tooltip }) => ({
    default: Tooltip,
  })),
);

export default function ProjectTabControls({
  value,
  onChange,
}: ProjectTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(tab) => {
        if (tab === 'editor' || tab === 'storyboard') onChange(tab);
      }}
    >
      <TabsList
        aria-label="Project views"
        className="project-tabs bg-transparent p-0"
      >
        {projectViews.map((tab, index) => {
          const label = tab === 'editor' ? 'Editor' : 'Storyboard';
          const Icon = tab === 'editor' ? Film : PanelsTopLeft;
          return (
            <Suspense key={tab} fallback={null}>
              <Tooltip content={label}>
                <TabsTrigger
                  id={'project-' + tab + '-tab'}
                  value={tab}
                  aria-label={label}
                  aria-controls={'project-' + tab + '-panel'}
                  onKeyDown={(event) => {
                    // Focus used for tooltips and view restoration must not select
                    // a view. Only explicit tab navigation activates on focus.
                    const target =
                      event.key === 'ArrowRight' || event.key === 'ArrowLeft'
                        ? projectViews[1 - index]
                        : event.key === 'Home'
                          ? projectViews[0]
                          : event.key === 'End'
                            ? projectViews[1]
                            : undefined;
                    if (target) onChange(target);
                  }}
                  render={<Button variant="ghost" size="icon-sm" />}
                  className="min-h-8 p-0 data-active:shadow-none"
                >
                  <Icon aria-hidden="true" />
                </TabsTrigger>
              </Tooltip>
            </Suspense>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
