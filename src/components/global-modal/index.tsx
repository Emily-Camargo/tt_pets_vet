import { useRef, useEffect, ReactNode, useState, useCallback, memo } from 'react';
import { Rnd } from 'react-rnd';
import { Close } from '@mui/icons-material';
import Footer, { ButtonProps } from '../footer';
import CustomLoaders from '../Loader';
import { cn } from '../../lib/utils';
import { IconButton } from '@mui/material';

interface ModalProps {
  bg?: string;
  open: boolean;
  altura: string;
  titulo: string;
  largura: string;
  children: ReactNode;
  overflow?: 'hidden' | 'auto';
  closeModal?: (params: false) => void;
  footerButtons?: ButtonProps[];
  loading?: boolean;
}

const ModalC = ({
  bg = 'white',
  open,
  altura,
  titulo,
  largura,
  children,
  overflow = 'auto',
  closeModal,
  footerButtons,
  loading,
}: ModalProps) => {
  const rndRef = useRef<Rnd>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [widthM, setWidthM] = useState(largura);
  const [heightM, setHeightM] = useState(altura);

  const handleClose = useCallback(() => {
    if (closeModal) {
      closeModal(false);
    }
  }, [closeModal]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeModal) {
        handleClose();
      }
    },
    [closeModal, handleClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.width = '100vw';

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        x: (windowWidth - parseInt(largura)) / 3,
        y: (windowHeight - parseInt(altura)) / 3,
      });
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.width = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.width = 'auto';
    };
  }, [open, largura, altura]);

  if (!open) {
    return null;
  }

  return (
    <div className={cn('absolute top-0 left-0 w-full h-full z-999')}>
      <Rnd
        ref={rndRef}
        size={{ width: widthM, height: heightM }}
        position={position}
        minWidth={300}
        minHeight={100}
        onDragStop={(_e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResizeStop={(_e, _direction, ref) => {
          setWidthM(ref.style.width);
          setHeightM(ref.style.height);
        }}
        className="rounded-lg shadow-modal"
        style={{ borderRadius: '7px' }}
      >
        <div className="flex-col relative w-full" style={{ height: `calc(${heightM} - 36px)` }}>
          <div className="flex justify-between items-center bg-white rounded-t-2xl p-3">
            <p className="truncate text-lg">{titulo}</p>
            {closeModal && (
              <IconButton
                id="close-modal"
                onClick={handleClose}
                title="Fechar"
                className="bg-white text-black !shadow-none hover:bg-red-hover hover:text-white"
              >
                <Close />
              </IconButton>
            )}
          </div>

          <div className="h-full w-full rounded-b-xl" style={{ backgroundColor: bg, overflow }}>
            {loading ? <CustomLoaders open /> : children}
          </div>

          {footerButtons && <Footer buttons={footerButtons} />}
        </div>
      </Rnd>
    </div>
  );
};

const Modal = (data: ModalProps) => {
  return data.open && <ModalC {...data}>{data.children}</ModalC>;
};

Modal.displayName = 'Modal';
export default memo(Modal);
