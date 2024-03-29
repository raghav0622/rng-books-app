import { Company, CompanyFYMeta, CreateCompany } from '@/schema';
import { FormError } from '@rng-apps/forms';
import { kebabCase } from 'lodash';
import { useCurrentUser } from './1-user-context';
import { useUserDB } from './2-user';
import { useFYDB } from './4-fy';

export const useCompanyDB = () => {
  const user = useCurrentUser();
  const { updateUser } = useUserDB();
  const companies = user.companies;
  const { removeFY } = useFYDB();

  const getCompany = (id: string | number) => {
    const company = user.companies.find((v) => v.id === id);

    return company;
  };

  const createCompany = async (payload: CreateCompany): Promise<Company> => {
    const isNameExisting =
      user.companies.filter(
        (c) => c.name.toLowerCase() === payload.name.trim().toLowerCase()
      ).length > 0;

    if (isNameExisting) {
      throw new FormError('Please provide unique company name', 'name');
    }

    const company = {
      id: kebabCase(payload.name.trim()),
      ...payload,
      fy: [],
    } as Company;

    await updateUser(user.id, {
      companies: [...user.companies, company],
    });

    return company;
  };

  const updateCompany = async (id: string, payload: Partial<Company>) => {
    const companyIndex = user.companies.findIndex((c) => c.id === id);
    const company = user.companies[companyIndex];

    const updatedCompany = {
      ...company,
      ...payload,
    } as Company;

    const updateCompanies = [...user.companies];

    updateCompanies.splice(companyIndex, 1, updatedCompany);

    await updateUser(user.id, {
      companies: updateCompanies,
    });
  };

  const deleteCompany = async (id: string) => {
    const company = getCompany(id) as Company;

    const companyIndex = user.companies.findIndex((c) => c.id === company.id);

    const updatedCompanies = [...user.companies];

    updatedCompanies.splice(companyIndex, 1);

    await Promise.all(company.fy.map(async (fy) => await removeFY(fy.id)));

    await updateUser(user.id, {
      companies: updatedCompanies,
    });
  };

  const addFYinCompany = async (company: Company, fy: CompanyFYMeta) => {
    const updateCompanyFYList = [...company.fy, fy];

    updateCompany(company.id, {
      fy: updateCompanyFYList,
    });
  };

  const removeFYinCompany = async (company: Company, fy: string) => {
    const fyPayload = [...company.fy].filter((i) => i.id !== fy);
    await updateCompany(company.id, {
      fy: fyPayload,
    });
  };

  return {
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    companies,
    addFYinCompany,
    removeFYinCompany,
  };
};
