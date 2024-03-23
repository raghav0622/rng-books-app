import { useCompanyDB, useFYDB } from '@/db';
import { Company, CompanyFYMeta, InitiateFYSchema } from '@/schema';
import {
  Anchor,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RNGActionIcon, RNGForm } from '@rng-apps/forms';
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';
import UserConfirmPassword from '../App/User-Confirm-Password';

const CompanyInitiateFY: React.FC<{ company: Company }> = ({ company }) => {
  const { initiateFY } = useFYDB();
  const { addFYinCompany } = useCompanyDB();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        className=""
        opened={opened}
        onClose={close}
        title="Authentication"
      >
        <RNGForm
          name="initiate-company-data-form"
          schema={InitiateFYSchema}
          defaultValues={{
            capitalBackForward: 0,
            cashInHand: 0,
            startYear:
              new Date().getMonth() > 2
                ? new Date().getFullYear()
                : new Date().getFullYear() - 1,
          }}
          uiSchema={[
            {
              name: 'startYear',
              label: 'Starting F.Y.',
              type: 'number',
              autoFocus: true,
            },
            {
              name: 'capitalBackForward',
              label: 'Capital Carry from Prev Year',
              type: 'currency',
              negativeValueOnly: true,
            },
            {
              name: 'cashInHand',
              label: 'Cash Carry from Prev Year',
              type: 'currency',
              positveValueOnly: true,
            },
          ]}
          submitButton={{ label: 'Initiate Data' }}
          onSubmit={async (payload) => {
            const fy = await initiateFY(company, payload);
            await addFYinCompany(company, {
              id: fy.id,
              userId: fy.userId,
              companyId: fy.companyId,
              startYear: fy.startYear,
              endYear: fy.endYear,
              name: fy.name,
              locked: fy.locked,
            });
            await close();
          }}
        />
      </Modal>
      <Button onClick={open}>Initiate Company Data</Button>
    </>
  );
};

const CompanyFYItem: React.FC<{ fy: CompanyFYMeta }> = ({ fy }) => {
  const { removeFYinCompany, getCompany } = useCompanyDB();
  const { removeFY } = useFYDB();
  const router = useRouter();
  const company = getCompany(fy.companyId);

  if (!company) return <>error</>;
  return (
    <Card withBorder p="sm">
      <Group justify="space-between">
        <Tooltip label={`Goto ${fy.name}`}>
          <Anchor size="md" onClick={() => router.push(`/fy/${fy.id}`)}>
            {fy.name}
          </Anchor>
        </Tooltip>
        {company.fy[company.fy.length - 1].id === fy.id && (
          <UserConfirmPassword
            title={`Delete ${fy.name} in ${company.name}`}
            description={'This action is irreversable. All data will be lost.'}
            onSuccess={async () => {
              await removeFYinCompany(company, fy.id);
              await removeFY(fy.id);
            }}
          >
            {(open) => (
              <RNGActionIcon
                onClick={open}
                size="sm"
                color="red"
                variant="outline"
                tooltip={`Delete ${fy.name}`}
              >
                <IconTrash />
              </RNGActionIcon>
            )}
          </UserConfirmPassword>
        )}
      </Group>
    </Card>
  );
};

const CompanyItem: React.FC<{ company: Company }> = ({ company }) => {
  const { deleteCompany } = useCompanyDB();
  return (
    <Card withBorder p="lg">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="lg">{company.name}</Text>
          <UserConfirmPassword
            title={`Delete Company: ${company.name}`}
            description={`All data related to this company will be forever deleted.`}
            onSuccess={async () => await deleteCompany(company.id)}
          >
            {(open) => (
              <RNGActionIcon
                tooltip={`Delete Company: ${company.name}`}
                color="red"
                variant="outline"
                onClick={open}
              >
                <IconTrash />
              </RNGActionIcon>
            )}
          </UserConfirmPassword>
        </Group>

        {company.fy.length === 0 ? (
          <CompanyInitiateFY company={company} />
        ) : (
          company.fy.map((fy) => (
            <CompanyFYItem fy={fy} key={fy.id + 'dashboard'} />
          ))
        )}
      </Stack>
    </Card>
  );
};

export default CompanyItem;
