import { useAuthAPI, useCurrentUser } from '@/db';
import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Text,
  rem,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogout, IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect } from 'react';
export function UserMenu() {
  const user = useCurrentUser();

  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    console.log(computedColorScheme);
    if (computedColorScheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [computedColorScheme]);

  const { signout } = useAuthAPI();
  return (
    <>
      <Menu
        withArrow
        position="bottom"
        transitionProps={{ transition: 'pop' }}
        withinPortal
      >
        <Menu.Target>
          <ActionIcon radius="xl">
            <Avatar
              variant="filled"
              radius="xl"
              color="blue"
              className="cursor-pointer"
              src={user.photoUrl}
            >
              {user.name[0]}
            </Avatar>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Group>
              <Avatar radius="xl" src={user.photoUrl}>
                {user.name[0]}
              </Avatar>

              <div>
                <Text fw={500}>{user.name}</Text>
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
              </div>
            </Group>
          </Menu.Item>

          <Menu.Divider />
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            onClick={() =>
              setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
            }
            leftSection={
              colorScheme === 'dark' ? (
                <IconSun
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              ) : (
                <IconMoon
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              )
            }
          >
            Switch to {colorScheme === 'dark' ? 'light' : 'dark'} mode
          </Menu.Item>
          <Menu.Item
            onClick={async () => await signout()}
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
