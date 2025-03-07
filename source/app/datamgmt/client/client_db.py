#  IRIS Source Code
#  Copyright (C) 2021 - Airbus CyberSecurity (SAS)
#  ir@cyberactionlab.net
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU Lesser General Public
#  License as published by the Free Software Foundation; either
#  version 3 of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
#  Lesser General Public License for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with this program; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
import marshmallow
from sqlalchemy import func, and_
from typing import List

from app import db
from app.datamgmt.exceptions.ElementExceptions import ElementInUseException
from app.datamgmt.exceptions.ElementExceptions import ElementNotFoundException
from app.models import Cases
from app.models import Client
from app.models import Contact
from app.models.authorization import User, UserClient
from app.schema.marshables import ContactSchema
from app.schema.marshables import CustomerSchema


def get_client_list(current_user_id: int = None,
                    is_server_administrator: bool = False) -> List[dict]:
    if not is_server_administrator:
        filter = and_(
            Client.client_id == UserClient.client_id,
            UserClient.user_id == current_user_id
        )
    else:
        filter = and_()
    client_list = Client.query.with_entities(
        Client.name.label('customer_name'),
        Client.client_id.label('customer_id'),
        Client.client_uuid.label('customer_uuid'),
        Client.description.label('customer_description'),
        Client.custom_attributes,
        Client.short.label('customer_short'),
        Client.client_search_terms.label('customer_search_terms'),
        Client.client_id_top.label('customer_id_top')
    ).filter(
        filter
    ).all()
    output = []
    for c in client_list:
        ctx = c._asdict()
        if ctx["customer_id_top"]:
            ctx["customer_top"] = Client.query.get(ctx["customer_id_top"]).name
        else:
            ctx["customer_top"] = ""
        output.append(ctx)

    return output


def get_contact_list(current_user_id: int = None,
                     is_server_administrator: bool = False) -> List[dict]:
    if not is_server_administrator:
        filter = and_(
            Client.client_id == UserClient.client_id,
            UserClient.user_id == current_user_id
        )
    else:
        filter = and_()

    contact_list = Contact.query.with_entities(
        Contact.contact_name.label('contact_name'),
        Contact.id.label('contact_id'),
        Contact.contact_uuid.label('contact_uuid'),
        Contact.contact_role.label('contact_role'),
        Contact.contact_email.label('contact_email'),
        Contact.client_id.label('contact_client_id'),
    ).filter(
        filter
    ).all()
    output = []
    for c in contact_list:
        ctx = c._asdict()
        if ctx["contact_client_id"]:
            ctx["contact_client"] = Client.query.get(ctx["contact_client_id"]).name
        else:
            ctx["contact_client"] = ""
        output.append(ctx)

    return output


def get_client(client_id: int) -> Client:
    client = Client.query.filter(Client.client_id == client_id).first()
    return client


def get_client_api(client_id: str) -> Client:
    client = Client.query.with_entities(
        Client.name.label('customer_name'),
        Client.client_id.label('customer_id'),
        Client.client_uuid.label('customer_uuid'),
        Client.description.label('customer_description'),
        Client.custom_attributes,
        Client.short.label('customer_short'),
        Client.client_search_terms.label('customer_search_terms'),
        Client.client_id_top.label('customer_id_top')
    ).filter(Client.client_id == client_id).first()

    output = None
    if client:
        output = client._asdict()
    if output["customer_id_top"]:
        output["customer_top"] = Client.query.get(output["customer_id_top"]).name
    else:
        output["customer_top"] = ""
    return output


def get_client_cases(client_id: int):
    cases_list = Cases.query.with_entities(
        Cases.case_id.label('case_id'),
        Cases.case_uuid.label('case_uuid'),
        Cases.name.label('case_name'),
        Cases.description.label('case_description'),
        Cases.status_id.label('case_status'),
        User.name.label('case_owner'),
        Cases.open_date,
        Cases.close_date
    ).filter(
        Cases.client_id == client_id,
    ).join(
        Cases.user
    ).all()

    return cases_list


def add_nested_contact(org, contact_list):
    template = {
        "org_name": org.name,
        "org_short": org.short
    }
    if org.top_org:
        template["org_top"] = org.top_org.name
        template["org_top_short"] = org.top_org.short
    contacts = get_client_contacts(org.client_id)
    for contact in contacts:
        ctx = dict(template)
        ctx["contact_role"] = contact.contact_role
        ctx["contact_email"] = contact.contact_email
        ctx["contact_note"] = contact.contact_note
        ctx["contact_work_phone"] = contact.contact_work_phone
        ctx["contact_mobile_phone"] = contact.contact_mobile_phone
        ctx["contact_name"] = contact.contact_name
        contact_list.append(ctx)
    for e in org.children_orgs:
        add_nested_contact(e, contact_list)


def export_contacts(current_user_id: int = None,
                    is_server_administrator: bool = False):
    orgs = Client.query.filter(Client.client_id_top == None).all()
    ctx = []
    for e in orgs:
        add_nested_contact(e, ctx)
    return ctx


def create_client(data) -> Client:
    client_schema = CustomerSchema()
    if not type(data.get("customer_customer")) == str or len(data.get("customer_customer")) == 0:
        data["customer_customer"] = None
    else:
        data["customer_customer"] = int(data["customer_customer"])
    client = client_schema.load(data)

    db.session.add(client)
    db.session.commit()

    return client


def _strip(data):
    print(data)
    return data.contact_role.lower().replace(" ", "").split(",")


def get_client_contacts(client_id: int) -> List[Contact]:
    contacts = Contact.query.filter(
        Contact.client_id == client_id
    ).order_by(
        Contact.contact_name
    ).all()
    contacts_sorted = []
    print("sorted", contacts)
    for role in ["ressort-isb", "isb"]:
        ctx = []
        for e in contacts:
            if role in _strip(e):
                ctx.append(e)
        f_pf = list(filter(lambda x: len(_strip(x)) == 1
                                     and x.contact_name == "Funktionspostfach", contacts_sorted))

        fv_cc = list(filter(lambda x: role in _strip(x) and "cc" in _strip(x)
                                      and x.contact_name == "Funktionspostfach", contacts_sorted))

        fv_pf = list(filter(lambda x: role in _strip(x)[0] and "vertretung" in _strip(x)
                                      and len(_strip(x)) == 1
                                      and x.contact_name == "Funktionspostfach", contacts_sorted))


        sonst = [item for item in ctx if item not in f_pf + fv_cc + fv_pf]
        sonst.sort(key=lambda x: x.contact_name, reverse=True)
        contacts_sorted += f_pf + fv_cc + fv_pf + sonst
    all_contacts = [item for item in contacts if item not in contacts_sorted]
    all_contacts.sort(key=lambda x: x.contact_name, reverse=True)

    return all_contacts


def get_client_contact(client_id: int, contact_id: int) -> Contact:
    contact = Contact.query.filter(
        Contact.client_id == client_id,
        Contact.id == contact_id
    ).first()

    return contact


def delete_contact(contact_id: int) -> None:
    contact = Contact.query.filter(
        Contact.id == contact_id
    ).first()

    if not contact:
        raise ElementNotFoundException('No Contact found with this uuid.')

    try:

        db.session.delete(contact)
        db.session.commit()

    except Exception as e:
        raise ElementInUseException('A currently referenced contact cannot be deleted')


def create_contact(data, customer_id) -> Contact:
    data['client_id'] = customer_id
    contact_schema = ContactSchema()
    contact = contact_schema.load(data)

    db.session.add(contact)
    db.session.commit()

    return contact


def update_contact(data, contact_id, customer_id) -> Contact:
    contact = get_client_contact(customer_id, contact_id)
    data['client_id'] = customer_id
    contact_schema = ContactSchema()
    contact_schema.load(data, instance=contact)

    db.session.commit()

    return contact


def update_client(client_id: int, data) -> Client:
    # TODO: Possible reuse somewhere else ...
    client = get_client(client_id)

    if not client:
        raise ElementNotFoundException('No Customer found with this uuid.')

    if not type(data.get("customer_customer")) == str or len(data.get("customer_customer")) == 0:
        data["customer_customer"] = None
    else:
        data["customer_customer"] = int(data["customer_customer"])
    exists = Client.query.filter(
        Client.client_id != client_id,
        func.lower(Client.name) == data.get('customer_name').lower()
    ).first()

    if exists:
        raise marshmallow.exceptions.ValidationError(
            "Customer already exists",
            field_name="customer_name"
        )

    client_schema = CustomerSchema()
    client_schema.load(data, instance=client)

    db.session.commit()

    return client


def delete_client(client_id: int) -> None:
    client = Client.query.filter(
        Client.client_id == client_id
    ).first()

    if not client:
        raise ElementNotFoundException('No Customer found with this uuid.')

    try:

        db.session.delete(client)
        db.session.commit()

    except Exception as e:
        raise ElementInUseException('A currently referenced customer cannot be deleted')


def get_case_client(case_id: int) -> Client:
    client = Cases.query.filter(case_id == case_id).with_entities(
        Cases.client_id
    ).first()

    return client
