import {
  IconButton,
  SpeedDial as SpeedDialMaterial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
} from '@material-tailwind/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { memo } from 'react'
import { Add } from '@mui/icons-material'

interface SpeedDialProps {
  newRecord?: () => void;
  customButton?: {
    text: string;
    icon: JSX.Element;
    onClick: () => void;
    render?: boolean;
  };
}

const SpeedDial = memo(
  ({ newRecord, customButton }: SpeedDialProps) => {
    const buttons = [
      customButton,
      {
        text: 'Novo registro',
        icon: <Add className="text-grzsecondary" />,
        onClick: newRecord,
        render: !!newRecord,
      },
    ].filter(Boolean);

    return (
      <div className="fixed bottom-10 right-10 z-50">
        <SpeedDialMaterial>
            <SpeedDialHandler>
              <IconButton size="md" className="rounded-full bg-grzprimary">
                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent className="bg-white">
              {buttons.map(
                (v) =>
                  v?.render && (
                    <div
                      className="flex items-center justify-between w-52 transition-transform duration-100 hover:scale-105 cursor-pointer"
                      key={v.text}
                    >
                      <p className="text-left text-grzprimary font-semibold text-sm">
                        {v.text}
                      </p>
                      <SpeedDialAction
                        onClick={v.onClick}
                        className="relative -left-8 bg-white"
                      >
                        {v.icon}
                      </SpeedDialAction>
                    </div>
                  ),
              )}
            </SpeedDialContent>
          </SpeedDialMaterial>
      </div>
    )
  },
)

SpeedDial.displayName = 'SpeedDial'
export default SpeedDial
